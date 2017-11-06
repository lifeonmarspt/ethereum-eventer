# Forever On The Chain

Etch a permanent message into the Ethereum blockchain.

## Solidity contract

### Source

```
pragma solidity ^0.4.0;

contract Eventer {
  event Record(
    address _from,
    string _message
  );

  function record(string message) {
    Record(msg.sender, message);
  }
}
```

### ABI

```js
[
  {
    "constant": false,
    "inputs": [
      {
        "name": "message",
        "type": "string"
      }
    ],
    "name": "record",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "Record",
    "type": "event"
  }
]
```

### Deployment through geth

```js
accountAddress = "0x..."
Eventer = eth.contract(JSON.parse('[{"constant":false,"inputs":[{"name":"message","type":"string"}],"name":"record","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_message","type":"string"}],"name":"Record","type":"event"}]'));
evmCode = "0x6060604052341561000f57600080fd5b6101a28061001e6000396000f300606060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e51ace1614610046575b600080fd5b341561005157600080fd5b6100a1600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506100a3565b005b7fac0fdae5d3299ac82cf049834f149484c5cafb1584ffd1e2432597e4581b16a73382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561013857808201518184015260208101905061011d565b50505050905090810190601f1680156101655780820380516001836020036101000a031916815260200191505b50935050505060405180910390a1505600a165627a7a7230582072753d1dba2d2af2ca7f9e6bbf4577d28d9b66d49136bcfbafdd08bc104437ee0029";
contract = Eventer.new({from: accountAddress, data: evmCode, gas: 200000})
```

### Testing with Truffle

Save the following into `test/eventer.js`.

```js
var Eventer = artifacts.require("Eventer");

contract('Eventer', function(accounts) {
  it("record event", function(done) {
    Eventer.deployed().then(function (instance) {
      instance.Record({}, {fromBlock: 0, toBlock: "latest"}).get(function (error, events) {
        assert.equal(0, events.length, "There should be no events at start.");
        instance.record("pokemon").then(function () {
          instance.Record({}, {fromBlock: 0, toBlock: "latest"}).get(function (error, events) {
            assert.equal(1, events.length, "There should be one event after recording.");
            done();
          });
        });
      });
    });
  });
});
```

Make sure `testrpc` is running and Truffle is configured. Thenrun the test with `truffle test ./test/eventer.js`.
