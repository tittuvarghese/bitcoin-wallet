const bitcoin = require('bitcoinjs-lib');
// Bitcoind RPC
const Client = require('bitcoin-core');
const request = require('request');

const client = new Client({username: 'admin', password: 'password', network: 'testnet'})
const satoshiConverter = 100000000;

const senderKey = bitcoin.ECPair.fromWIF('cUCrtCPc9sBtAa2y9dSfd5pR1Huz4aVQZhFMSzWvJDRYeTgXR8DA', bitcoin.networks.testnet)
const senderAddress = 'mwjHY5N9x5GjxfvCLW3bvuvdixfwQ3nmtc'
const receiverAddress = 'ms4ud1Npr9MVfHr5Uv5hsMjyDE6zqF3NfH'

const txb = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
txb.setVersion(1) // Changes based on consensus. Commonly used version is 1

// BTC Txn Fee
let txnFee = 0.0005 * satoshiConverter // 0.0004 BTC

// BTC to Satoshi Conversion - Input Amount
let txnInputAmount = 0.000565 * satoshiConverter; // 0.7 BTC

// BTC to Satoshi Conversion - Output Amount
let txnOutputAmount = txnInputAmount - txnFee

// Fee = Input - Output

/*
* Very Important Part to get UTX
*/

// {
//             "tx_hash":"38a923aa8af54f1bb3f53f541775e8daf3b5227044fe36ae4ba45cb862d89c51",
//             "tx_hash_big_endian":"519cd862b85ca44bae36fe447022b5f3dae87517543ff5b31b4ff58aaa23a938",
//             "tx_index":405001571,
//             "tx_output_n": 0,
//             "script":"a9144616b2c00cfc401861b98e86ccce47a683ed63da87",
//             "value": 10000000,
//             "value_hex": "00989680",
//             "confirmations":6730
// }

let accumilateValue = 0;
let transactionProcessed = false;
let balanceAmount = 0;

request('https://api.blockcypher.com/v1/btc/test3/addrs/'+senderAddress+'?unspentOnly=true&token=33e0954b05094211b3241cc1c088b8d8', { json: true }, (err, res, utx) => {
  if(err) {
    console.log("unable to fetch utx.")
  } else if(res.statusCode == 500) {
    console.log("No UTXs found")
  } else {
    utx.txrefs.forEach(function(singleUtx) {

      if(singleUtx.value >= txnInputAmount) {

        txb.addInput(singleUtx.tx_hash, singleUtx.tx_output_n) // Sender Address, (Index) Vout

        // TxnFee = Input - Output
        balanceAmount = singleUtx.value - txnInputAmount;

        txb.addOutput(receiverAddress, txnOutputAmount) // Reciever Address, Txn Amount Satoshis.
        txb.addOutput(senderAddress, balanceAmount) // Sender Address, Txn Amount Satoshis. Balance to origin address

        txb.sign(0, senderKey)
        let rawTxn = txb.build().toHex()
        console.log(rawTxn)
        // Boradcast
        // client.sendRawTransaction(rawTxn, (error, response) => {
        //   if (error) console.log(error);
        //   console.log(response)
        // });

        transactionProcessed = true
      }
    });

    if(transactionProcessed == false) {
        utx.txrefs.forEach(function(singleUtx, index) {
          accumilateValue += singleUtx.value
          txb.addInput(singleUtx.tx_hash, singleUtx.tx_output_n) // Sender Address, Input Amount
          txb.sign(index+1, senderKey)
        });

        if(accumilateValue <= txnInputAmount) {

          balanceAmount = accumilateValue - txnInputAmount;

          txb.addOutput(receiverAddress, txnOutputAmount) // Reciever Address, Txn Amount Satoshis.
          txb.addOutput(senderAddress, balanceAmount) // Sender Address, Txn Amount Satoshis. Balance to origin address

          let rawTxn = txb.build().toHex()
          console.log(rawTxn)
          // Boradcast
          // client.sendRawTransaction(rawTxn, (error, response) => {
          //   if (error) console.log(error);
          //   console.log(response)
          // });

        } else {
          console.log("Not enough balance")
        }
    }

  }
});

// Please be aware of the above part
