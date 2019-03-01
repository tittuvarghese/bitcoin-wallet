// const bitcoin = require('bitcoinjs-lib');
// // Bitcoind RPC
// const Client = require('bitcoin-core');
// const request = require('request');
//
// const client = new Client({username: 'admin', password: 'password', network: 'testnet'})
// const satoshiConverter = 100000000;
//
// const senderKey = bitcoin.ECPair.fromWIF('KzLTeRZXFMHCgZ4nS2BDgFeKkEyQBBBrnfXeULo5rjv7jDc6GVrb')
// const senderAddress = '1oFFCV2U24rKNBzQQ1BPv6F2z9suiAnG9'
// cosnt receiverAddress = '1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP'
//
// const txb = new bitcoin.TransactionBuilder()
// txb.setVersion(1) // Changes based on consensus. Commonly used version is 1
//
// // BTC Txn Fee
// let txnFee = 0.0004 * satoshiConverter // 0.0004 BTC
//
// // BTC to Satoshi Conversion - Input Amount
// let txnInputAmount = 0.001 * satoshiConverter; // 0.7 BTC
//
// // BTC to Satoshi Conversion - Output Amount
// let txnOutputAmount = txnInputAmount - txnFee
//
// // Fee = Input - Output
//
// /*
// * Very Important Part to get UTX
// */
//
// // {
// //             "tx_hash":"38a923aa8af54f1bb3f53f541775e8daf3b5227044fe36ae4ba45cb862d89c51",
// //             "tx_hash_big_endian":"519cd862b85ca44bae36fe447022b5f3dae87517543ff5b31b4ff58aaa23a938",
// //             "tx_index":405001571,
// //             "tx_output_n": 0,
// //             "script":"a9144616b2c00cfc401861b98e86ccce47a683ed63da87",
// //             "value": 10000000,
// //             "value_hex": "00989680",
// //             "confirmations":6730
// // }
//
// let accumilateValue = 0;
// let transactionProcessed = false;
//
// request('https://blockchain.info/unspent?active='+senderAddress, { json: true }, (err, res, utx) => {
//   if(err) {
//     console.log("unable to fetch utx.")
//   } else if(res.statusCode == 500) {
//     console.log("No UTXs found")
//   } else {
//     utx.unspent_outputs.forEach(function(singleUtx) {
//       if(singleUtx.value >= txnInputAmount) {
//
//         txb.addInput(singleUtx.tx_hash_big_endian, singleUtx.value) // Sender Address, Input Amount
//
//         // TxnFee = Input - Output
//         txb.addOutput(receiverAddress, txnOutputAmount) // Reciever Address, Txn Amount Satoshis.
//         txb.sign(0, senderKey)
//         let rawTxn = txb.build().toHex()
//         console.log(rawTxn)
//         // Boradcast
//         client.sendRawTransaction(rawTxn, (error, response) => {
//           if (error) console.log(error);
//           console.log(response)
//         });
//
//         transactionProcessed = true
//       }
//     });
//
//     if(transactionProcessed == false) {
//         utx.unspent_outputs.forEach(function(singleUtx) {
//           accumilateValue += singleUtx.value
//           txb.addInput(singleUtx.tx_hash_big_endian, singleUtx.value) // Sender Address, Input Amount
//         });
//
//         if(accumilateValue <= txnInputAmount) {
//
//           txb.addOutput(receiverAddress, txnOutputAmount) // Reciever Address, Txn Amount Satoshis.
//           txb.sign(0, senderKey)
//           let rawTxn = txb.build().toHex()
//           console.log(rawTxn)
//           // Boradcast
//           client.sendRawTransaction(rawTxn, (error, response) => {
//             if (error) console.log(error);
//             console.log(response)
//           });
//
//         } else {
//           console.log("Not enough balance")
//         }
//     }
//
//   }
// });
//
// // Please be aware of the above part


const bitcoin = require('bitcoinjs-lib');
// Bitcoind RPC
const Client = require('bitcoin-core');
const request = require('request');

const client = new Client({username: 'admin', password: 'password', network: 'testnet'})
const satoshiConverter = 100000000;

const senderKey = bitcoin.ECPair.fromWIF('L1MJ8FDmZpBwqPXfJ7T3REDPxgSvseJujR73J7eocNHwnHyrDYGn')
const senderAddress = 'mnYnSadn6pch3LtpCUKey1Xs3rHXsgqC8T'
const receiverAddress = 'mx9ii3wLMKu7XjEGfUrdBAKJNYEJsyULXU'

const txb = new bitcoin.TransactionBuilder('bitcoin.networks.testnetwork')
txb.setVersion(1) // Changes based on consensus. Commonly used version is 1

// BTC Txn Fee
let txnFee = 0.0004 * satoshiConverter // 0.0004 BTC

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

request('https://testnet.blockchain.info/unspent?active='+senderAddress, { json: true }, (err, res, utx) => {
  if(err) {
    console.log("unable to fetch utx.")
  } else if(res.statusCode == 500) {
    console.log("No UTXs found")
  } else {
    utx.unspent_outputs.forEach(function(singleUtx) {
      if(singleUtx.value >= txnInputAmount) {

        txb.addInput(singleUtx.tx_hash_big_endian, singleUtx.value) // Sender Address, Input Amount

        // TxnFee = Input - Output
        txb.addOutput(receiverAddress, txnOutputAmount) // Reciever Address, Txn Amount Satoshis.
        txb.sign(0, senderKey)
        let rawTxn = txb.build().toHex()
        console.log(rawTxn)
        // Boradcast
        client.sendRawTransaction(rawTxn, (error, response) => {
          if (error) console.log(error);
          console.log(response)
        });

        transactionProcessed = true
      }
    });

    if(transactionProcessed == false) {
        utx.unspent_outputs.forEach(function(singleUtx) {
          accumilateValue += singleUtx.value
          txb.addInput(singleUtx.tx_hash_big_endian, singleUtx.value) // Sender Address, Input Amount
        });

        if(accumilateValue <= txnInputAmount) {

          txb.addOutput(receiverAddress, txnOutputAmount) // Reciever Address, Txn Amount Satoshis.
          txb.sign(0, senderKey)
          let rawTxn = txb.build().toHex()
          console.log(rawTxn)
          // Boradcast
          client.sendRawTransaction(rawTxn, (error, response) => {
            if (error) console.log(error);
            console.log(response)
          });

        } else {
          console.log("Not enough balance")
        }
    }

  }
});
