// Allows us to use ES6 in our migrations and tests.
require('babel-register')

const HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
networks: {
  development: {
   host: "127.0.0.1",
   port: 9545,
   network_id: "*" // Match any network id
 },
 rinkeby: {
  provider: function() {
 return new HDWalletProvider("{metmask mnemonic}", "{infura link}")
     },
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000,
    }
   },
// Configure your compilers
compilers: {
    solc: {
       version: "0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
 };
