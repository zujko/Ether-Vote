const express = require('express');
const exphbs = require('express-handlebars');
var solc = require('solc');
const app = express();
const port = 3001;
var Web3 = require('web3');
var path = require('path');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var fs = require('fs');
code = fs.readFileSync('ElectionContract.sol').toString();

compiledCode = solc.compile(code);


abiDefinition = JSON.parse(compiledCode.contracts[':Election'].interface);
VotingContract = web3.eth.contract(abiDefinition);
byteCode = compiledCode.contracts[':Election'].bytecode;

var contractInstance = undefined;
deployedContract = VotingContract.new('Test Election', 10, ['Person 1','Person 2','Person 3'], {data: byteCode, from: web3.eth.accounts[0], gas: 4800000}, function(e, res) {
  contractInstance = VotingContract.at(res.address);
  console.log("Got contract instance")
});

//contractInstance = VotingContract.at(deployedContract.address);

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
  }))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (request, response) => {
  response.send(contractInstance.getElectionName())
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
