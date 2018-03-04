var fs = require('fs');
var Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
code = fs.readFileSync('ElectionContract.sol').toString();
//console.log('CODE: ' + code);
solc = require('solc');
compiledCode = solc.compile(code);

abiDefinition = JSON.parse(compiledCode.contracts[':ElectionContract'].interface);
VotingContract = web3.eth.contract(abiDefinition);
byteCode = compiledCode.contracts[':ElectionContract'].bytecode;
deployedContract = VotingContract.new(['Person 1','Person 2','Person 3'],{data: byteCode, from: web3.eth.accounts[0], gas: 4800000});
contractInstance = VotingContract.at(deployedContract.address);


//abi = JSON.parse(compiledCode.abiDefinition);
VotingContract = web3.eth.contract(abiDefinition);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = VotingContract.at(deployedContract.address);
candidates = {"Person 1": "candidate-1", "Person 2": "candidate-2", "Person 3": "candidate-3"}

function voteForCandidate() {
  candidateName = $("#candidate").val();
  contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
    let div_id = candidates[candidateName];
    $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
  });
}

$(document).ready(function() {
  candidateNames = Object.keys(candidates);
  
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    let val = contractInstance.totalVotesFor.call(name).toString()
    $("#" + candidates[name]).html(val);
  }
});
