window.addEventListener("load", function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);

    // use local rpc server instead of MetaMask
    //var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    // use remote rpc server
    var web3_remote = new Web3(new Web3.providers.HttpProvider("http://ec2-34-213-193-94.us-west-2.compute.amazonaws.com:8545"));

    // select default account (for use without MetaMask)
    //web3.eth.defaultAccount = "0x13f53d42fc7cf4f1cf4ca8031a526f6a8528cdfa";

    // eventer contract ABI
    var abi = JSON.parse('[{"constant":false,"inputs":[{"name":"message","type":"string"}],"name":"record","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_message","type":"string"}],"name":"Record","type":"event"}]');

    // eventer contract address
    var address = "0x258F4A2B9318849a92BfF86dBf8daD166617Ec96";

    var eventer = web3.eth.contract(abi).at(address);
    var eventer_remote = web3_remote.eth.contract(abi).at(address);

    document.querySelector("div#chain").style.display = "block";

    var logDiv = document.querySelector("#log");
    var recorderForm = document.querySelector("#recorder");
    var recorderInput = document.querySelector("#recorder input[type=text]");
    var recorderButton = document.querySelector("#recorder input[type=submit]");
    var recorderLink = document.querySelector("#recorder a");
    var loadingP = document.querySelector("p#loading");

    // get tx receipt, for when it arrives we know the tx is mined
    var getTransactionReceipt = function (txId) {
      web3.eth.getTransactionReceipt(txId, function (error, result) {
        if (result === null) {
          setTimeout(function () { getTransactionReceipt(txId) }, 500);
        } else {
          recorderButton.disabled = false;
          recorderButton.value = "Save";
          recorderInput.disabled = false;
          recorderInput.value = "";
          recorderLink.text = "";
          recorderLink.href = "";
        }
      });
    };

    recorderForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // call record method on contract
      eventer.record(recorderInput.value, function (error, txId) {
        if (!error) {
          recorderInput.disabled = true;
          recorderButton.disabled = true;
          recorderButton.value = "mining...";
          recorderLink.text = "view transaction";
          recorderLink.href = "http://etherscan.io/tx/" + txId;
          getTransactionReceipt(txId);
        }
      });
    });

    // get old and watch for new Record events
    eventer_remote.Record({}, {fromBlock: 4491369, toBlock: "latest"}).watch(function (error, result) {
      if (loadingP) { loadingP.remove(); }
      var p = document.createElement("p");
      p.className = "message";
      p.textContent = result.args._message;
      logDiv.prepend(p);
    });
  } else {
    document.querySelector("p#no-metamask").style.display = "block";
  }
});
