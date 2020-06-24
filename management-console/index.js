require("dotenv").config()
const minimist = require("minimist");
const inquirer = require("./prompts");
const abi = require("./abi");
const Web3 = require('web3');
const web3 = new Web3(process.env.PROVIDER)

module.exports = async () => {
  const args = minimist(process.argv.slice(2));
  let cmd = args._[0] || "help";

  if (args.version || args.v) {
    cmd = "version";
  }

  if (args.help || args.h) {
    cmd = "help";
  }
  try {
    switch (cmd) {
      case "mint": {
        const mintOptions = await inquirer.askMintInputs();
        // Get nonce
            const nonce = await 
        break;
      }
      case "burn": {
        const burnOptions = await inquirer.askBurnInputs();
        console.log(burnOptions);
        break;
      }
      case "transfer": {
        const transferOptions = await inquirer.askTransferInputs();
        console.log(transferOptions);
        break;
      }
      case "transferFrom": {
        const transferFromOptions = await inquirer.askTransferFromInputs();
        console.log(transferFromOptions);
        break;
      }
      case "approve": {
        const approveOptions = await inquirer.askApproveInputs();
        console.log(approveOptions);
        break;
      }
    }
  } catch (e) {
    console.log(e);
  }
};
