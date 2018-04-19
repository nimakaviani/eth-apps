var Web3 = require ("web3")

var vcap_services = JSON.parse(process.env.VCAP_SERVICES)
var host = vcap_services["eth"][0]["credentials"]["host"]
var port = vcap_services["eth"][0]["credentials"]["ports"]["8545/tcp"]
var abi = vcap_services["eth"][0]["credentials"]["eth_node"]["abi"]
var contractAddr = vcap_services["eth"][0]["credentials"]["eth_node"]["contract_address"]
var addr = vcap_services["eth"][0]["credentials"]["eth_node"]["address"]
console.log(host, port, abi)

const web3 = new Web3(new Web3.providers.HttpProvider("http://"+host+":"+port));

var VotingContract = web3.eth.contract(JSON.parse(abi));
var contractInstance = VotingContract.at(contractAddr)

candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

const express = require('express')
const app = express()
const server_port = 8080

app.get('/vote', (request, response) => {
  voteForCandidate(request.query.name)
})

app.get('/result', (request, response) => {
  getVotes()
})

var path = require('path');

// viewed at http://localhost:8080
app.use(express.static('static'))
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../static/index.html'));
});

app.listen(server_port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})


function voteForCandidate(candidateName) {
  contractInstance.voteForCandidate(candidateName, {from: addr}, function() {
    let div_id = candidates[candidateName];
    contractInstance.totalVotesFor.call(candidateName)
  });
}

function getVotes(){
  candidateNames = ["Rama", "Jose", "Nick"];
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    let val = contractInstance.totalVotesFor.call(name).toString()
    $("#" + candidates[name]).html(val);
  }
}
