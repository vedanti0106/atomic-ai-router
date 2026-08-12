import { x402Client } from '@x402-avm/core/client';
import { registerExactAvmScheme } from '@x402-avm/avm/exact/client';
import { toClientAvmSigner, ALGORAND_TESTNET_CAIP2 } from '@x402-avm/avm';
import { decodePaymentRequiredHeader, encodePaymentSignatureHeader } from '@x402-avm/core/http';
import algosdk from 'algosdk';

const CLIENT_MNEMONIC = 'canoe credit pyramid emerge decade wolf enter type fine earth pact broom carbon tray myself laugh unusual virus army pen maple alpha magic ability over';

async function runTest() {
  console.log('=== x402 Algorand Testnet Verification Script ===');
  
  // 1. Initialize client wallet from mnemonic
  const clientSeed = algosdk.mnemonicToSecretKey(CLIENT_MNEMONIC);
  const clientAddress = clientSeed.addr.toString();
  console.log('Client Wallet Address:', clientAddress);
  
  // Check if client is opted in to USDC (10458941)
  const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
  try {
    const accountInfo = await algodClient.accountInformation(clientAddress).do();
    const assets = accountInfo.assets || [];
    const isOptedIn = assets.some((a: any) => a['asset-id'] === 10458941);
    
    if (!isOptedIn) {
      console.log('Account is NOT opted in to USDC (ASA 10458941). Attempting automatic opt-in...');
      const params = await algodClient.getTransactionParams().do();
      const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: clientAddress,
        receiver: clientAddress,
        assetIndex: 10458941,
        amount: 0,
        suggestedParams: params
      });
      const txId = optInTxn.txID();
      const signedTxn = optInTxn.signTxn(clientSeed.sk);
      await algodClient.sendRawTransaction(signedTxn).do();
      console.log('Opt-in transaction submitted. TxID:', txId);
      console.log('Waiting for confirmation...');
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      console.log('Opt-in confirmed successfully!');
    } else {
      console.log('Account is already opted in to USDC.');
    }
  } catch (err: any) {
    console.error('Error during opt-in check:', err.message);
    console.log('Make sure this account has ALGO for transaction fees!');
  }
  
  // 2. Call endpoint unauthenticated
  const url = 'http://localhost:3001/api/premium/weather';
  console.log(`\n1. Fetching premium resource (unpaid) from ${url}...`);
  const initialRes = await fetch(url);
  
  console.log('Response Status:', initialRes.status);
  if (initialRes.status !== 402) {
    console.log('Expected 402 Payment Required status. Got:', initialRes.status);
    console.log(await initialRes.text());
    process.exit(1);
  }
  
  // 3. Extract and parse challenge
  const challengeHeader = initialRes.headers.get('payment-required');
  if (!challengeHeader) {
    console.log('Expected payment-required header in response.');
    process.exit(1);
  }
  
  console.log('Payment Required Header (Base64):', challengeHeader);
  const paymentRequired = decodePaymentRequiredHeader(challengeHeader);
  console.log('Parsed Challenge:', JSON.stringify(paymentRequired, null, 2));
  
  // 4. Set up x402 client and register scheme
  console.log('\n2. Initializing x402 client and signing payment payload...');
  const base64PrivateKey = Buffer.from(clientSeed.sk).toString('base64');
  const clientSigner = toClientAvmSigner(base64PrivateKey);
  
  const client = new x402Client();
  registerExactAvmScheme(client, { signer: clientSigner });
  
  // Generate payment payload
  const paymentPayload = await client.createPaymentPayload(paymentRequired);
  console.log('Generated Payment Payload:', JSON.stringify(paymentPayload, null, 2));
  
  // Encode payload as signature header
  const signatureHeader = encodePaymentSignatureHeader(paymentPayload);
  console.log('Payment Signature Header (Base64):', signatureHeader);
  
  // 5. Retry request with signature header
  console.log(`\n3. Retrying request with Payment-Signature header...`);
  const retryRes = await fetch(url, {
    headers: {
      'Payment-Signature': signatureHeader
    }
  });
  
  console.log('Retry Response Status:', retryRes.status);
  const responseText = await retryRes.text();
  console.log('Response Body:', responseText);
  
  if (retryRes.ok) {
    const paymentResponseHeader = retryRes.headers.get('payment-response');
    console.log('\n4. SUCCESS! Verified on-chain.');
    console.log('Payment Response Header:', paymentResponseHeader);
  } else {
    console.log('Failed to verify payment.');
  }
}

runTest().catch((err) => {
  console.error('Fatal Test Error:', err);
});
