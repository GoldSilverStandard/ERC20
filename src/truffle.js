module.exports = {

  plugins: [
    "truffle-security",
    "solidity-coverage"
  ],

  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4600000
    },
    rinkeby: {
      network_id: 4,
      host: "192.168.1.104",
      port: 8545,
      gas: 2900000,
      from: "0xa1138fccd5f8E126E8d779CF78a547517307559d"
    }
  },
  compilers: {
    solc: {
      version: "0.6.4",
    }
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions : { 
      currency: "AUD"
    }
  }
};
