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
          .transfer(transferOptions.to, transferOptions.value)
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
            transferFromOptions.value
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
          .approve(approveOptions.spender, approveOptions.value)
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
        const totalSupply = await tokenContract.methods.totalSupply().call();
        console.log(
          "Total token supply is:",
          BigNumber(totalSupply).div(10000).toString()
        );
        break;
      }
      default: {
        console.log("Unknown command, exiting");
        break;
      }
    }
  } catch (e) {
    console.log(e);
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
