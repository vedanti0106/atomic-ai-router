import algosdk from 'algosdk';

const receiverAcc = algosdk.generateAccount();
const receiverMnemonic = algosdk.secretKeyToMnemonic(receiverAcc.sk);

const clientAcc = algosdk.generateAccount();
const clientMnemonic = algosdk.secretKeyToMnemonic(clientAcc.sk);

console.log('=== GENERATED ALGORAND WALLETS ===');
console.log('--- 1. RECEIVER WALLET (payTo) ---');
console.log('Address:', receiverAcc.addr.toString());
console.log('Mnemonic:', receiverMnemonic);
console.log('Private Key (Hex):', Buffer.from(receiverAcc.sk).toString('hex'));
console.log('');
console.log('--- 2. CLIENT WALLET (tester) ---');
console.log('Address:', clientAcc.addr.toString());
console.log('Mnemonic:', clientMnemonic);
console.log('Private Key (Hex):', Buffer.from(clientAcc.sk).toString('hex'));
console.log('==================================');

