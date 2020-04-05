module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4600000
    },
    rinkeby:  {
      network_id: 4,
      host: "192.168.1.104",
      port: 8545,
      gas: 2900000,
      from: "0xa1138fccd5f8E126E8d779CF78a547517307559d"
      // provider: function() {
      //   return new HDWalletProvider(mnemonic, "http://192.168.1.130");
      // }
      //provider: new Web3.providers.HttpProvider("http://192.168.1.130:8545")
    }
  },
  compilers: {
    solc: {
      version: "0.4.24",
    }
  }
};
