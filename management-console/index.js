require("dotenv").config();
const minimist = require("minimist");
const inquirer = require("./prompts");
const abi = require("./abi");
const Web3 = require("web3");
const web3 = new Web3(process.env.PROVIDER);
const tokenContract = new web3.eth.Contract(abi);
const BigNumber = require("bignumber.js");

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
        // Create unsigned transaction abi
        const txData = tokenContract.methods
          .mint(
            mintOptions.address,
            web3.utils.utf8ToHex(mintOptions.location),
            web3.utils.utf8ToHex(mintOptions.serial),
            BigNumber(mintOptions.value).times(10000).toString()
          )
          .encodeABI();
        console.log(
          "Parameters: \n",
          mintOptions,
          "\n\nThe mint transaction prepared for signing: \n\n",
          await generateTx(txData)
        );
        break;
      }
      case "burn": {
        const burnOptions = await inquirer.askBurnInputs();
        const txData = tokenContract.methods
          .burn(
            web3.utils.utf8ToHex(burnOptions.location),
            web3.utils.utf8ToHex(burnOptions.serial)
          )
          .encodeABI();
        console.log(
          "Parameters: \n",
          burnOptions,
          "\n\nThe burn transaction prepared for signing: \n\n",
          await generateTx(txData)
        );
        break;
      }
      case "transfer": {
        const transferOptions = await inquirer.askTransferInputs();
        const txData = tokenContract.methods
          .transfer(
            transferOptions.to,
            BigNumber(transferOptions.value).times(10000).toString()
          )
          .encodeABI();
        console.log(
          "Parameters: \n",
          transferOptions,
          "\n\nThe transfer transaction prepared for signing: \n\n",
          await generateTx(txData)
        );
        break;
      }
      case "transferFrom": {
        const transferFromOptions = await inquirer.askTransferFromInputs();
        const txData = tokenContract.methods
          .transferFrom(
            transferFromOptions.addressFrom,
            transferFromOptions.addressTo,
            BigNumber(transferFromOptions.value).times(10000).toString()
          )
          .encodeABI();
        console.log(
          "Parameters: \n",
          transferFromOptions,
          "\n\nThe transfer from transaction prepared for signing: \n\n",
          await generateTx(txData)
        );
        break;
      }
      case "approve": {
        const approveOptions = await inquirer.askApproveInputs();
        const txData = tokenContract.methods
          .approve(
            approveOptions.spender,
            BigNumber(approveOptions.value).times(10000).toString()
          )
          .encodeABI();
        console.log(
          "Parameters: \n",
          approveOptions,
          "\n\nThe approve spending transaction prepared for signing: \n\n",
          await generateTx(txData)
        );
        break;
      }
      case "sendTransaction": {
        const tx = await inquirer.askSendTransactionInputs();
        console.log("Sending raw transaction....");
        await web3.eth
          .sendSignedTransaction(tx.transaction)
          .on("receipt", (receipt) => {
            console.log("Transaction receipt received: \n", receipt);
          });
        break;
      }
      case "totalSupply": {
        const addressToCheck = await inquirer.askTotalSupplyInputs();
        tokenContract.options.address = addressToCheck.address;
        const totalSupply = await tokenContract.methods.totalSupply().call();
        console.log(
          "Total token supply is:",
          BigNumber(totalSupply).div(10000).toString()
        );
        break;
      }
      case "lastUpdated": {
        const addressToCheck = await inquirer.askTotalSupplyInputs();
        tokenContract.options.address = addressToCheck.address;
        const value = await tokenContract.methods.lastUpdated().call();
        console.log("Last Updated: ", value);
        break;
      }
      case "stockCount": {
        const addressToCheck = await inquirer.askTotalSupplyInputs();
        tokenContract.options.address = addressToCheck.address;
        const value = await tokenContract.methods.stockCount().call();
        console.log("Stock Count: ", value);
        break;
      }
      case "decimals": {
        const addressToCheck = await inquirer.askTotalSupplyInputs();
        tokenContract.options.address = addressToCheck.address;
        const value = await tokenContract.methods.decimals().call();
        console.log("Decimals: ", value);
        break;
      }
      case "balanceOf": {
        const addressToCheck = await inquirer.askBalanceOfInputs();
        tokenContract.options.address = addressToCheck.address;
        const value = await tokenContract.methods
          .balanceOf(addressToCheck.who)
          .call();
        console.log(
          "Balance for ",
          addressToCheck.who,
          " is ",
          BigNumber(value).div(10000).toString()
        );
        break;
      }
      case "allowance": {
        break;
      }
      case "decreaseFee": {
        break;
      }
      case "increaseFee": {
        break;
      }
      case "addToWhiteList": {
        break;
      }
      case "removeFromWhiteList": {
        break;
      }
      case "inAnyWhiteList": {
        break;
      }
      case "updateBurner": {
        break;
      }
      case "updateMinter": {
        break;
      }
      case "updateFeeHolder": {
        break;
      }
      case "isFeeExempt": {
        break;
      }
      case "pauseContract": {
        break;
      }
      case "version": {
        console.log("Version 1.0.0");
        break;
      }
      case "help": {
        console.log(`
        Valid commands:
        mint \t\t\t Generates a transaction to mint and send tokens
        burn \t\t\t Generates a transaction to burn specific tokens
        transfer \t\t Generates a transaction to transfer tokens to a recipient
        transferFrom \t\t Generates a transaction to move tokens from sender to recipient using the allowance mechanism. 
        approve \t\t Generates a transaction to approve a spender for a specific amount
        totalSupply \t\t Retrieves the total supply of an ERC20 compatible token
        sendTransaction \t Sends a raw (signed) transaction to the network
        version \t\t The current version of the tool
        help \t\t\t Displays help information
        `);
        break;
      }
      default: {
        console.log("Unknown command, exiting");
        break;
      }
    }
  } catch (e) {
    console.error(e);
    process.exit();
  }
  process.exit();
};

async function generateTx(data, nonce) {
  return {
    nonce: await web3.eth.getTransactionCount(process.env.SENDER_ADDRESS),
    value: "0",
    data,
  };
}
