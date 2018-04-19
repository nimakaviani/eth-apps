var sleep = require('sleep');
var Web3 = require ("web3")
// var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var vcap_services = JSON.parse(process.env.VCAP_SERVICES)
var host = vcap_services["eth"][0]["credentials"]["host"]
var port = vcap_services["eth"][0]["credentials"]["ports"]["8545/tcp"]
var abi = vcap_services["eth"][0]["credentials"]["eth_node"]["abi"]
var contractAddr = vcap_services["eth"][0]["credentials"]["eth_node"]["contract_address"]
var addr = vcap_services["eth"][0]["credentials"]["eth_node"]["address"]
console.log(host, port, abi)

const web3 = new Web3(new Web3.providers.HttpProvider("http://"+host+":"+port));

var contract = web3.eth.contract(JSON.parse(abi));
var contractInstance = contract.at(contractAddr)

userAddr = "0x" + addr

var value = 'hello ';
var params = {
  from: userAddr
};


const express = require('express')
const app = express()
const server_port = 8080

app.get('/set', (request, response) => {
  contractInstance.set(value + request.query.name, params);
  response.send('saved value')
})

app.get('/get', (request, response) => {
  var value = contractInstance.get.call()
  response.send('value ' + value)
})

app.listen(server_port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
