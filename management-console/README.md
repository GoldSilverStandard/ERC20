# Token Management CLI

## Commands

- `mint`
- `burn`
- `transfer`
- `transferFrom`
- `approve`
- `totalSupply`
- `sendTransaction`

## Installation

Install the token cli

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

## Test data, remove

0x896756178b309e42ea606d992AbD5d225755bB46

signed ropsten tx:
0xf8ab818885012a05f2008307a1209484cbc5ee75a62afb41bce21680151ae2ec68eff380b844095ea7b3000000000000000000000000c5eb6a07018d267111050c41f3862b2bccbdc86f00000000000000000000000000000000000000000000000000000000000000051ba0a201f0d96f0391dbdb2934410eec0cf322a9503e1086c837fd45747e57e29be1a041a50faa46e7e90d55f723aa87c3f8008dedc39fd2aebb292ac19101076412ea
