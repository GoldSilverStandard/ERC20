# Gold Silver Standard ERC20
ERC20 Tokens for the Gold Silver Standard
See https://www.goldsilverstandard.com

## Contract Address
Gold Silver Standard now uses the ENS goldsiverstandard.ens

| Network | Token | Ens | Owner |
| --- | --- | --- | --- |
| Main | AUS | aus.goldsilverstandard.ens | `0x5b04fbaF54d53f1a4681339A0Da34D903E5FA2B1` |
| Main | AGS | ags.goldsilverstandard.ens | `0x7db5454F3500f28171d1f9c7a38527C9cF94e6b2` |

# Building Contracts

## Deploying a contract

Contracts can be deployed to the various networks configured in truffle.js.

To set up your environment for deploying contracts, you will need to create a
.env file. .env defines the various Ethereum blockchain environment variable.

```
cp env.example .env
```

Once created, change the mnemonic and network settings to match your environment.

To deploy a contract to a network, run:

```
truffle deploy --network NETWORK_NAME
```

where NETWORK_NAME is the network you wish to deploy to. The names of the various networks are listed in truffle.js.

For example, to deploy to Ropsten:

```
truffle deploy --network ropsten
```

## Registering a contract on Etherscan

The source code will need to be flattened to register a contract on Etherscan.

To flatten the contract code:

```
cd /path/to/project/files/
npx truffle-flattener contracts/Token.sol > build/contracts/Token.flattened.sol
```

Go to Etherscan (https://etherscan.io/) and load the contract. There will be a
"verify" link. Click on this link and specify the following:

Contract Type: single file
Contract Compiler Version: 0.6.4

(There are now two other Contract Types for registering source code; multi-file, and json; these are experimental and will require more investigation).

# Auditing

## Mythril/Truffle Security

Automated audits are run using Truffle Security, the truffle implementation of Mythril.

To install:

```
npm i -D https://github.com/ConsenSys/truffle-security.git
```

or to install from package.json:

```
npm i
```

(NOTE: currently there is a bug in the tag releases for Truffle Security https://github.com/ConsenSys/truffle-security/issues/255. Once this is resolved, the npmjs package will be referenced and these documents updated).

To run a security audit:

Firstly, a Mythx account is required so an API KEY can be registered. An account can be created at https://mythx.io. Once, registered, generate the API KEY and copy it.

Once copied, open up a command line terminal, and, once in the miner-site project directory, declare the API KEY as an environment variable, E.g.

```
export MYTHX_API_KEY=abc123
```

where abc123 is your MYTHX API KEY.

To launch an audit, run:

```
truffle run verify
```

Once completed, you can retrieve the report from your Mythx.io account.

## Solidity coverage

Solidity coverage checks that all tests cover all Solidity contract code.

To install:

```
npm i -D solidity-coverage
```

or to install from package.json:

```
npm i
```

To launch a code coverage test, run:

```
truffle run coverage
```

To see which files are covered by solidity coverage or to add and remove files files from the code coverage, see .solcover.js.
