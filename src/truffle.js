//var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "tragic near rocket across biology shop push dragon jazz detail differ say";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "5777", // Match any network id
      gas: 4600000
    },
    rinkeby:  {
      network_id: 4,
      host: "http://192.168.1.130",
      port: 8545,
      gas: 2900000,
      from: "0xa1138fccd5f8E126E8d779CF78a547517307559d"
      // provider: function() {
      //   return new HDWalletProvider(mnemonic, "http://192.168.1.130");
      // }
      //provider: new Web3.providers.HttpProvider("http://192.168.1.130:8545")
    }
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};
