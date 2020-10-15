require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
    plugins: ["truffle-security", "solidity-coverage"],
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 6721975,
        },
        ropsten: {
            provider: () => {
                return new HDWalletProvider(
                    process.env.MNEMONIC,
                    process.env.ROPSTEN_URL,
                    process.env.ROPSTEN_ACCOUNT_ID
                );
            },
            network_id: "3",
            gas: 4500000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true,
        },
        main: {
            provider: () => {
                return new HDWalletProvider(
                    "",
                    "https://mainnet.infura.io/v3/64710bd1f20c42519965cd9c1dab700b",
                    0
                );
            },
            network_id: "1",
            //gas: 10000000,
            gas: 4600000,
            gasPrice: 50000000000,
            confirmations: 2,
            timeoutBlocks: 100,
            skipDryRun: false,
        }
    },
    rinkeby: {
      network_id: 4,
      host: "192.168.1.127",
      port: 8545,
      gas: 2900000,
      from: "0xa1138fccd5f8E126E8d779CF78a547517307559d"
    },
    ropsten: {
      provider: () => {
          return new HDWalletProvider(
              process.env.MNEMONIC,
              process.env.ROPSTEN_URL,
              process.env.ROPSTEN_ACCOUNT_ID
          );
      },
      network_id: "3",
      gas: 4500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    }
  },
  compilers: {
    solc: {
      version: "0.6.0",
    }
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions : { 
      currency: "AUD"
    }
  }
};
