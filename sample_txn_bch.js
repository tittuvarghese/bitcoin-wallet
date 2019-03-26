const request = require('request');
const explorers = require('bitcore-explorers')
// const insight = new explorers.Insight('https://test-bch-insight.bitpay.com')
const bch = require('bitcore-lib-cash')
const satoshiConverter = 100000000;

let privateKey = new bch.PrivateKey('KxxRyrfLhDVz4ZuoUKTuKRcrapVBdvkc9bxusd5yuyYqjGUn3tXg');
let senderAddress = privateKey.toAddress('testnet') //bchtest:qps60h780gvjcn80gn6d576w2nt80k47tv0wa2e6j6"
let receiverAddress = "bchtest:qps60h780gvjcn80gn6d576w2nt80k47tv0wa2e6j6"

let txnAmount = 0.0009 * satoshiConverter // 0.001 BCH


request('https://test-bch-insight.bitpay.com/api/addrs/'+senderAddress+'/utxo', { json: true }, (err, res, utxos) => {
  if(err) {
    console.log("unable to fetch utx.")
  } else if(res.statusCode == 500) {
    console.log("No UTXs found")
  } else {

    const transaction = new bch.Transaction()
        .from(utxos)
        .to(receiverAddress, txnAmount)
        .change(senderAddress)
        .sign(privateKey)

      console.log(transaction.toString())

  }
});
