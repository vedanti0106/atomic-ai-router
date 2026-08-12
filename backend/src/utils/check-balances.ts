import algosdk from 'algosdk';

const CLIENT_ADDRESS = 'FUGQN6PVT6H33RHP6ILS2ETHLVM34DXKVWLO2LBKZLK4X2VW3YCHUNWKJE';
const RECEIVER_ADDRESS = 'HSUQ6VRS7DOKPFYQCSXC2ORLVW63BX6LNPMAIFVMCRAKD4G6O3DBUL6DWQ';

async function checkBalances() {
  console.log('=== Algorand Testnet Balance Check ===');
  const client = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
  
  for (const [name, addr] of [['Client Wallet', CLIENT_ADDRESS], ['Receiver Wallet', RECEIVER_ADDRESS]]) {
    console.log(`\n${name}: ${addr}`);
    try {
      const accountInfo = await client.accountInformation(addr).do();
      const algoBalance = Number(accountInfo.amount) / 1e6;
      console.log(`ALGO Balance: ${algoBalance} ALGO`);
      
      const assets = accountInfo.assets || [];
      const usdcAsset = assets.find((a: any) => Number(a.assetId) === 10458941);
      if (usdcAsset) {
        const usdcBalance = Number(usdcAsset.amount) / 1e6;
        console.log(`USDC Balance: $${usdcBalance} USDC`);
      } else {
        console.log('USDC Balance: NOT OPTED IN');
      }
    } catch (err: any) {
      if (err.message.includes('404') || err.message.includes('Account not found') || err.message.includes('no account')) {
        console.log('Account Status: NOT INITIALIZED on-chain (0 ALGO, 0 USDC)');
      } else {
        console.error('Error fetching balance:', err.message);
      }
    }
  }
}

checkBalances().catch(console.error);
