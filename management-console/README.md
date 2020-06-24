# Token Management CLI

## Commands

- `mint`
- `burn`
- `transfer`
- `transferFrom`
- `approve`
- `totalSupply` Prints the current total supply of the token
- `sendTransaction` Sends a raw (signed) transaction to the network.

## Installation

Install the token cli.

```bash
git clone https://github.com/GoldSilverStandard/ERC20.git
cd ERC20/management-console
yarn install
cp example.env .env
```

You will want to make sure that the values in the newly created `.env` file are correct.
An example `.env` file is provided below. `PROVIDER` should be a secure websockets provider endpoint. `SENDER_ADDRESS` is the address you will be sending the transaction from. This is used for nonce management.

```
PROVIDER="wss://mainnet.infura.io/ws/v3/YOUR-PROJECT-ID"
SENDER_ADDRESS="0x8325aBBB91775651CE44C87AcC80c47778c91814"
```

## Usage

Ensure you are in the `ERC20/management-console` directory.

Use like any other console command. For example to create a mint transaction: `./bin/token-cli mint`. This will ask several questions, and generate the transaction.
You can then use the output with a tool like [EthOffline](https://ethjs.github.io/offline/) to create a signed transaction. The `sendTransaction` command will send a signed transaction to the network.
