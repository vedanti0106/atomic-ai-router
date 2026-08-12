import { Hono } from 'hono';
import { paymentMiddleware, x402ResourceServer } from '@x402-avm/hono';
import { ExactAvmScheme } from '@x402-avm/avm/exact/server';
import { ALGORAND_TESTNET_CAIP2, USDC_TESTNET_ASA_ID } from '@x402-avm/avm';
import { HTTPFacilitatorClient } from '@x402-avm/core/server';

const premiumRouter = new Hono();

// Initialize HTTPFacilitatorClient
const facilitatorClient = new HTTPFacilitatorClient({
  url: 'https://facilitator.goplausible.xyz'
});

// Create x402ResourceServer
const resourceServer = new x402ResourceServer(facilitatorClient);

// Register the AVM scheme
resourceServer.register('algorand:*', new ExactAvmScheme());

// Get receiver address from environment or dynamic keygen
const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS || 'HSUQ6VRS7DOKPFYQCSXC2ORLVW63BX6LNPMAIFVMCRAKD4G6O3DBUL6DWQ';

premiumRouter.use(
  '/weather',
  paymentMiddleware(
    {
      'GET /api/premium/weather': {
        accepts: {
          scheme: 'exact',
          price: '$0.01',
          network: ALGORAND_TESTNET_CAIP2,
          asset: USDC_TESTNET_ASA_ID,
          payTo: RECEIVER_ADDRESS,
        },
        description: 'Premium weather forecast API',
      },
    },
    resourceServer
  )
);

premiumRouter.get('/weather', (c) => {
  return c.json({
    success: true,
    data: {
      location: 'San Francisco, CA',
      temperature: '68°F',
      condition: 'Sunny with premium breeze',
      forecast: 'Clear skies all day, perfect for demoing x402!'
    }
  });
});

import { x402Client } from '@x402-avm/core/client';
import { registerExactAvmScheme } from '@x402-avm/avm/exact/client';
import { toClientAvmSigner } from '@x402-avm/avm';
import { decodePaymentRequiredHeader, encodePaymentSignatureHeader } from '@x402-avm/core/http';
import algosdk from 'algosdk';

premiumRouter.get('/balances', async (c) => {
  const client = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
  const CLIENT_ADDRESS = 'FUGQN6PVT6H33RHP6ILS2ETHLVM34DXKVWLO2LBKZLK4X2VW3YCHUNWKJE';
  const RECEIVER_ADDRESS = 'HSUQ6VRS7DOKPFYQCSXC2ORLVW63BX6LNPMAIFVMCRAKD4G6O3DBUL6DWQ';
  
  const getAccountData = async (addr: string) => {
    try {
      const accountInfo = await client.accountInformation(addr).do();
      const algo = Number(accountInfo.amount) / 1e6;
      const assets = accountInfo.assets || [];
      const usdcAsset = assets.find((a: any) => Number(a.assetId) === 10458941);
      const usdc = usdcAsset ? Number(usdcAsset.amount) / 1e6 : 0;
      return { algo, usdc, optedIn: usdcAsset !== undefined };
    } catch {
      return { algo: 0, usdc: 0, optedIn: false };
    }
  };

  const clientData = await getAccountData(CLIENT_ADDRESS);
  const receiverData = await getAccountData(RECEIVER_ADDRESS);

  return c.json({
    client: { address: CLIENT_ADDRESS, ...clientData },
    receiver: { address: RECEIVER_ADDRESS, ...receiverData }
  });
});

premiumRouter.post('/run-simulation', async (c) => {
  const logs: string[] = [];
  const CLIENT_MNEMONIC = 'canoe credit pyramid emerge decade wolf enter type fine earth pact broom carbon tray myself laugh unusual virus army pen maple alpha magic ability over';
  const url = 'http://localhost:3001/api/premium/weather';
  
  try {
    logs.push('1. Fetching premium resource (unpaid) from GET /api/premium/weather...');
    const initialRes = await fetch(url);
    logs.push(`Response status: ${initialRes.status} (Payment Required)`);
    
    const challengeHeader = initialRes.headers.get('payment-required')!;
    const paymentRequired = decodePaymentRequiredHeader(challengeHeader);
    
    logs.push('2. Initializing client AVM signer and signing transactions...');
    const clientSeed = algosdk.mnemonicToSecretKey(CLIENT_MNEMONIC);
    const base64PrivateKey = Buffer.from(clientSeed.sk).toString('base64');
    const clientSigner = toClientAvmSigner(base64PrivateKey);
    
    const client = new x402Client();
    registerExactAvmScheme(client, { signer: clientSigner });
    
    const paymentPayload = await client.createPaymentPayload(paymentRequired);
    logs.push('Payment transactions signed successfully!');
    
    const signatureHeader = encodePaymentSignatureHeader(paymentPayload);
    logs.push('3. Retrying request with on-chain Payment-Signature header...');
    
    const retryRes = await fetch(url, {
      headers: {
        'Payment-Signature': signatureHeader
      }
    });
    
    logs.push(`Retry response status: ${retryRes.status} (OK)`);
    const data = await retryRes.json();
    const paymentResponseHeader = retryRes.headers.get('payment-response');
    const responseData = JSON.parse(Buffer.from(paymentResponseHeader!, 'base64').toString());
    
    return c.json({
      success: true,
      logs,
      data,
      txId: responseData.transaction
    });
  } catch (error: any) {
    logs.push(`Simulation failed: ${error.message}`);
    return c.json({
      success: false,
      logs
    }, 500);
  }
});

export default premiumRouter;
