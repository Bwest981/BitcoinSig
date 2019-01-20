const express = require('express');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const bitcore = require("bitcore-lib");
var explorers = require('bitcore-explorers');
var insight = new explorers.Insight();

const Web3 = require('web3');
const web3 = new Web3(rpcURL);
//web3js = new web3(web3.currentProvider);
const contractABI =[
	{
		"constant": false,
		"inputs": [
			{
				"name": "_pKey",
				"type": "string[]"
			}
		],
		"name": "addKeys",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "multisig",
		"outputs": [
			{
				"name": "owner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_sigId",
				"type": "uint256"
			}
		],
		"name": "viewKeys",
		"outputs": [
			{
				"name": "",
				"type": "string[]"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

var thisContract;
var contractAddress ="0xd9ef51d6ed19dde4e96daa749076ba3396907f2c";
var thisContract = new web3.eth.Contract(contractABI, contractAddress);

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/', (req,res) => {
  res.render('index', {

  });
});
app.get('/index.html', (req,res) => {
  var privateKey = new bitcore.PrivateKey();
  var publicKey = privateKey.toPublicKey();
  var address = publicKey.toAddress();
  insight.getUnspentUtxos('1ASiCsPqAQhFYCoCCvH4DP2rUo1bCSc7oz', function(err, utxos) {
  if (err) {
    // Handle errors...
  } else {
    // Maybe use the UTXOs to create a transaction
    console.log("UTXO: " + utxos);
    // var tx = bitcore.Transaction();
    //      tx.from(utxos);
    //      tx.to("1ASiCsPqAQhFYCoCCvH4DP2rUo1bCSc7oz",amountSent); // Withdraw ammount here
    //      tx.change(address); //change goes back to old address
    //      tx.fee(50000);
    //      tx.sign(privateKey);
  }

});

  console.log(privateKey,address, publicKey);
  res.render('index', {
  });
});
app.get('/sendTransaction', (req,res) => {

  res.render('sendTransaction', {
  });
});
app.get('/EthContract', (req,res) => {

  res.render('EthContract', {
  });
});
app.get('/EthGetKeys', (req,res) => {

  res.render('EthGetKeys', {
  });
});

function getAddresses(uinput, callback){
  var input = new Buffer(uinput);
  console.log(address);
}

//POST
app.post("/createWallet", function(req,res){
  arr = [];
  for (var key in req.body.fields) {
    if (req.body.fields.hasOwnProperty(key)) {
      item = req.body.fields[key];
      addToArr(item);
      console.log(item);
    }
  }
  // const publicKeys = req.body.fields.hasOwnProperty(key);
  // console.log(publicKeys);
  // const publicKeys = [
  // '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
  // '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
  // '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'
  // ];
  const requiredSignatures = arr.length;
  const address = new bitcore.Address(arr, requiredSignatures);
  console.log(address);
  res.render('success', {
    address: address,
    array: arr
  });
});

app.post("/createKey", function(req,res){
  // arr = [];
  // for (var key in req.body.Efields) {
  //   item = req.body.Efields[key];
  //   addToArr(item);
  //   console.log(item);
  // }
  // thisContract.methods.addKeys(arr).call((error, result2) => {
  //    if (!error) {
  //      console.log("Result2: " + result2);
  //    }
  //    else {console.error("Error: " + error);}
  // })
  res.render('success', {
  });
});

app.post("/unlockWallet", function(req,res){
  arrP = [];
  for (var key in req.body.Pfields) {
    if (req.body.fields.hasOwnProperty(key)) {
      item = req.body.Pfields[key];
      addToArrP(item);
      console.log(item);
    }
  }
  var privateKeys = aarP;
  var publicKeys = privateKeys.map(bitcore.PublicKey);
  var address = new bitcore.Address(publicKeys, arrP.length); // 2 of 2
  insight.getUnspentUtxos('1DFVMTtpXqqBGsyJLMYLoNbTmj6nBt61tv', function(err, utxos) {
  if (err) {
  } else {
    console.log("UTXO: " + utxos);
    var tx = bitcore.Transaction();
         tx.from(utxos);
         tx.to("1ASiCsPqAQhFYCoCCvH4DP2rUo1bCSc7oz",amountSent); // Withdraw ammount here
         tx.change(address); //change goes back to old address
         tx.fee(50000);
         tx.sign(privateKey);
    }
  });
  res.render('successP', {
    address: address,
    array: arr
  });
});

// var utxo = {
//   "txId" : "153068cdd81b73ec9d8dcce27f2c77ddda12dee3db424bff5cafdbe9f01c1756",
//   "outputIndex" : 0,
//   "address" : address.toString(),
//   "script" : new bitcore.Script(address).toHex(),
//   "satoshis" : req.body.amount
// };


app.post("/makeRandom", function(req,res){
  arr = [];
  for (var key in req.body.Pfields) {
    if (req.body.fields.hasOwnProperty(key)) {
      item = req.body.Pfields[key];
      addToArrP(item);
      console.log(item);
    }
  }
  const requiredSignatures = arr.length;
  const address = new bitcore.Address(arr, requiredSignatures);
  console.log(address);
  res.render('success', {
    address: address,
    array: arr
  });
});

var arr = [];
function addToArr(arrData){
  arr.push(arrData);
}
var arrP = [];
function addToArrP(arrPData){
  arr.push(new bitcore.PrivateKey(arrPData));
}

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
