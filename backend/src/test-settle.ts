async function testSettle() {
  const payload = {
    "x402Version": 2,
    "payload": {
      "paymentGroup": [
        "iqNmZWXNB9CiZnbOA/LftqNnZW6sdGVzdG5ldC12MS4womdoxCBIY7UYpLPITsgQ8i1PEIHLD3HwWaesIN7GL39w5Qk6IqNncnDEIOCIthz6xa80X6iJI7DS2eqiFbZG/eiqKhY5oNW3Zqywomx2zgPy456kbm90ZcQceDQwMi1mZWUtcGF5ZXItMTc4NjU2MzE2Mzg0NKNyY3bEIMsKrTkfyEeqa+iRI5FyXlqZ6zCpfmHGYakedVaFrAg9o3NuZMQgywqtOR/IR6pr6JEjkXJeWpnrMKl+YcZhqR51VoWsCD2kdHlwZaNwYXk=",
        "gqNzaWfEQOmPe2fJLaboWXNI8qInZkxqX2HgE86dPAJIJ7eiSC2wT0f7pUlEj3bk5eT/OduKeOMnTmoIsVh25YBp3A3WNg6jdHhui6RhYW10zScQpGFyY3bEIDypD1Yy+NynlxAUri06K629sN/La9gEFqwUQKHw3nbGomZ2zgPy37ajZ2VurHRlc3RuZXQtdjEuMKJnaMQgSGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiKjZ3JwxCCD4fgmzmRDGGMe/kiSHB0S4/4wwMgAuP2Inw/i5njE8KJsds4D8uOrpG5vdGXEHXg0MDItcGF5bWVudC12Mi0xNzg2NTYzMTU4ODEwo3NuZMQgLQ0G+fWfj73E7/IXLRJnXVm+Duqtlu0sKsrVy+q23gSkdHlwZaVheGZlcqR4YWlkzgCflz0="
      ],
      "paymentIndex": 1
    },
    "resource": {
      "url": "http://localhost:3001/api/premium/weather",
      "description": "Premium weather forecast API",
      "mimeType": ""
    },
    "accepted": {
      "scheme": "exact",
      "network": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
      "amount": "10000",
      "asset": "10458941",
      "payTo": "HSUQ6VRS7DOKPFYQCSXC2ORLVW63BX6LNPMAIFVMCRAKD4G6O3DBUL6DWQ",
      "maxTimeoutSeconds": 300,
      "extra": {
        "name": "USDC",
        "decimals": 6,
        "feePayer": "ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA"
      }
    }
  };

  console.log('Sending direct settle request to facilitator...');
  const res = await fetch('https://facilitator.goplausible.xyz/v2/settle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  console.log('Facilitator response status:', res.status);
  const text = await res.text();
  console.log('Facilitator response body:', text);
}

testSettle().catch(console.error);
