const explorers = require('bitcore-explorers')
const insight = new explorers.Insight('https://test-bch-insight.bitpay.com')
const bch = require('bitcore-lib-cash')
const satoshiConverter = 100000000;

let privateKey = new bch.PrivateKey('KxxRyrfLhDVz4ZuoUKTuKRcrapVBdvkc9bxusd5yuyYqjGUn3tXg');
let senderAddress = privateKey.toAddress('testnet') //bchtest:qps60h780gvjcn80gn6d576w2nt80k47tv0wa2e6j6"
let receiverAddress = "bchtest:qps60h780gvjcn80gn6d576w2nt80k47tv0wa2e6j6"

let txnAmount = 0.001 * satoshiConverter // 0.001 BCH

insight.getUnspentUtxos(senderAddress, function (error, utxos) {
  if (error) {
    console.error(error)
    return
  }

  const utxo = {
    txid: utxos[0].txid,
    outputIndex: utxos[0].vout,
    script: utxos[0].scriptPubKey,
    satoshis: utxos[0].satoshis
  }

  const transaction = new bch.Transaction()
    .from(utxo)
    .to(receiverAddress, txnAmount)
    .sign(privateKey)

  console.log(transaction.toString())
})
