const Web3 = require('web3');
// const busSafe = require('../build/contracts/BusSafe.json');
const busSafe = require('../build/contracts/NewBusSafe.json');


const provider = new Web3.providers.HttpProvider("http://localhost:9545");

const web3 = new Web3(provider);


const smartContract = new web3.eth.Contract(
  // contacrct 정보를 입력해야함.
  busSafe.abi, // abi
  busSafe.networks[5777].address
);

module.exports = {
  web3,
  smartContract
}