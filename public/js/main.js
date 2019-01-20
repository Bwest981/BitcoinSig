$(function()
{
    $(document).on('click', '.btn-add', function(e)
    {
        e.preventDefault();

        var controlForm = $('.controls form:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);

        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function(e)
    {
		$(this).parents('.entry:first').remove();

		e.preventDefault();
		return false;
	});
});


const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

var thisContract;
var thisAbi=[
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
var contractAddress = "0xd9ef51d6ed19dde4e96daa749076ba3396907f2c";
var userAccount;



function startApp() {
      console.log("Address: "+ contractAddress);
      thisContract = web3js.eth.contract(thisAbi).at(contractAddress);
      console.log(thisContract);
      var accountInterval = setInterval(function() {
        // Check if account has changed
        if (web3.eth.accounts[0] !== userAccount) {
          userAccount = web3.eth.accounts[0];
          console.log(userAccount);
        }
      }, 10000);
    }

function callContract(){
      var arr = [];
      var elements = document.querySelectorAll("#my-form input[type=text]")
      for (var i = 0, element; element = elements[i++];) {
        if (element.type === "text" && element.value === ""){
          console.log("it's an empty textfield")
        }else{
          console.log(element.value);
          arr.push(element.value);
        }

      }
      thisContract.addKeys(arr,{from: web3.eth.accounts[0], gas:40000, gasPrice:1000000000},function(error, result){
      		 if(!error){
      			  console.log("Results: " + result);
      			} else
      			  console.error("Error: " + error);
      			});
    }

    function viewContract(){
      thisContract.viewKeys(document.getElementById('keyID').value,function(error, result){
      		 if(!error){
      			  console.log("Results: " + result);
              // document.getElementById('key-data').value = result;
              $("#key-data").html(result);
      			} else
      			  console.error("Error: " + error);
      			});
    }
    window.addEventListener('load', function() {
      console.log("test");
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
        console.log(web3js);
      } else {
        //web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        // Handle the case where the user doesn't have Metamask installed
        // Probably show them a message prompting them to install Metamask
    		console.log("Warning about MetaMask/Toshi");
    		$("#myModalLabel-warning").empty();
    		$("#modal-body-warning").empty();
    		$('#modal-footer-warning').empty();
    		$("#myModalLabel-warning").html(
    			"Warning!"
    		);
    		$("#modal-body-warning").html(
    			"This dApp is currently on the Robsten Network. It requires MetaMask for desktop or Toshi-Dev for Mobile."
    		);
    		$('#modal-footer-warning').html(
    			'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
    			)
    		$("#basicModal-warning").modal("show");
      }

      // Now you can start your app & access web3 freely:
    	if(!web3.isConnected()) {
        // show some dialog to ask the user to start a node
    	} else {
    	startApp();
    	}
    })
    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case "1":
          console.log('This is mainnet')
          break
        case "2":
          console.log('This is the deprecated Morden test network.')
          break
        case "3":
          console.log('This is the ropsten test network.')
          break
        case "4":
          console.log('This is the Rinkeby test network.')
          break
        case "42":
          console.log('This is the Kovan test network.')
          break
        default:
          console.log('This is an unknown network.')
      }
    })
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
          window.web3 = new Web3(ethereum);
          try {
              // Request account access if needed
              await ethereum.enable();
              // Acccounts now exposed
              console.log("Success.");
              //web3.eth.sendTransaction({/* ... */});

          } catch (error) {
              // User denied account access...
              console.log("User denied account access..." + error);
          }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
          window.web3 = new Web3(web3.currentProvider);
          // Acccounts always exposed
          //web3.eth.sendTransaction({/* ... */});
      }
      // Non-dapp browsers...
      else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    });
