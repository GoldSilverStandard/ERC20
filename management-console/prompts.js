const inquirer = require("inquirer");

module.exports = {
  askMintInputs: () => {
    const questions = [
      {
        name: "address",
        type: "input",
        message: "Enter the address to send the new tokens to:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a wallet address";
          }
        },
      },
      {
        name: "location",
        type: "input",
        message: "Enter the location for the tokens:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter the location.";
          }
        },
      },
      {
        name: "serial",
        type: "input",
        message: "Enter the serial number for the tokens:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter the serial.";
          }
        },
      },
      {
        name: "value",
        type: "input",
        message: "Enter the number of tokens to mint:",
        validate: function (value) {
          if (value.length && Number(value) > 0) {
            return true;
          } else {
            return "Please enter the number of tokens.";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askBurnInputs: () => {
    const questions = [
      {
        name: "location",
        type: "input",
        message: "Enter the location for the tokens",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid location";
          }
        },
      },
      {
        name: "serial",
        type: "input",
        message: "Enter the serial for the tokens:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter the serial.";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askTransferInputs: () => {
    const questions = [
      {
        name: "to",
        type: "input",
        message: "Enter the address to transfer the tokens to:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "value",
        type: "input",
        message: "Enter the number of tokens to transfer:",
        validate: function (value) {
          if (value.length && Number(value) > 0) {
            return true;
          } else {
            return "Please enter a valid amount";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askTransferFromInputs: () => {
    const questions = [
      {
        name: "addressFrom",
        type: "input",
        message: "Enter the address to transfer the tokens from:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "addressTo",
        type: "input",
        message: "Enter the address to transfer the tokens to:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "value",
        type: "input",
        message: "Enter the number of tokens to transfer:",
        validate: function (value) {
          if (value.length && Number(value) > 0) {
            return true;
          } else {
            return "Please enter a valid amount";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askApproveInputs: () => {
    const questions = [
      {
        name: "spender",
        type: "input",
        message: "Enter the spender's address:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "value",
        type: "input",
        message: "Enter the number of tokens to approve for spending:",
        validate: function (value) {
          if (value.length && Number(value) > 0) {
            return true;
          } else {
            return "Please enter a valid amount";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askSendTransactionInputs: () => {
    const questions = [
      {
        name: "transaction",
        type: "input",
        message: "Enter the signed transaction to send:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid transaction";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askTotalSupplyInputs: () => {
    const questions = [
      {
        name: "address",
        type: "input",
        message: "Enter the address of the token to check:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askBalanceOfInputs: () => {
    const questions = [
      {
        name: "address",
        type: "input",
        message: "Enter the address of the token to check:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "who",
        type: "input",
        message: "Enter the address of the account to get the balance for:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askAllowanceInputs: () => {
    const questions = [
      {
        name: "address",
        type: "input",
        message: "Enter the address of the token to check:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "owner",
        type: "input",
        message: "Enter the address of the token owner to check:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "spender",
        type: "input",
        message: "Enter the address of the spender:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askDecreaseFeeInputs: () => {
    const questions = [
      {
        name: "amount",
        type: "input",
        message: "Enter the amount to decrease the fee by:",
        validate: function (value) {
          if (value.length && Number(value) > 0) {
            return true;
          } else {
            return "Please enter a valid number";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askWhitelistInputs: () => {
    const questions = [
      {
        name: "index",
        type: "input",
        message: "Enter the whitelist index:",
        validate: function (value) {
          if (value.length && Number(value) > 0) {
            return true;
          } else {
            return "Please enter a valid number";
          }
        },
      },
      {
        name: "who",
        type: "input",
        message: "Enter the address for the whitelist operation:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter an address";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askInAnyWhitelistInputs: () => {
    const questions = [
      {
        name: "address",
        type: "input",
        message: "Enter the address of the token to check:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "who",
        type: "input",
        message: "Enter the address for the whitelist operation:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter an address";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askMintBurnInputs: () => {
    const questions = [
      {
        name: "who",
        type: "input",
        message: "Enter the address to update to:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter an address";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askInWhitelistInputs: () => {
    const questions = [
      {
        name: "address",
        type: "input",
        message: "Enter the address of the token to check:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "index",
        type: "input",
        message: "Enter the whitelist index:",
        validate: function (value) {
          if (value.length && Number(value) > 0) {
            return true;
          } else {
            return "Please enter a valid number";
          }
        },
      },
      {
        name: "who",
        type: "input",
        message: "Enter the address for the whitelist operation:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter an address";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  askFeeExempt: () => {
    const questions = [
      {
        name: "address",
        type: "input",
        message: "Enter the address of the token to check:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a valid address";
          }
        },
      },
      {
        name: "index",
        type: "input",
        message: "Enter the whitelist index:",
        validate: function (value) {
          if (value.length && Number(value) > 0) {
            return true;
          } else {
            return "Please enter a valid number";
          }
        },
      },
      {
        name: "who",
        type: "input",
        message: "Enter the address to check:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter an address";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
};
