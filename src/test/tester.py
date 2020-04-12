from web3 import Web3
# import json

# #node_url = "https://ropsten.infura.io/v3/eaf5e0b4a01042a48211762c8d4eec44"

# ## Rinkeby .105, Main .104
# #node_url = "http://192.168.1.105:8545"
# node_url = "http://192.168.1.104:8545"

# web3 = Web3(Web3.HTTPProvider(node_url))

# print(web3.isConnected())
# print(web3.eth.blockNumber)

# #owner = "0x5b04fbaF54d53f1a4681339A0Da34D903E5FA2B1"
# address = "0x5FB9E9C359CC7191b0293d2FAF1cC41cE3688D75"
# balance = web3.eth.getBalance(owner)

# print(balance)
# #balance = web3.eth.getBalance("ddemonstrate.eth")

# with open("build/contracts/Gold.json", "r") as f:
#     _json = json.load(f)
#     #print(_json["abi"])
#     abi = _json["abi"]

#     contract = web3.eth.contract(address=address, abi=abi)

#     ts = contract.functions.totalSupply().call()
#     print(ts)

#     #balance = erc20.functions.balanceOf(owner).call()
#     #print(balance)


#     #nonce = web3.eth.getTransactionCount(owner)
#     #print(nonce)


#     # tx = contract.functions.add(1,2).buildTransaction({'chainId': 3,'gas': 70000,'gasPrice': w3.toWei('1', 'gwei'),'nonce': nonce})
#     # private_key = '600f003a6ed434917afbbc7f03f2edf86a19f72448e2e9d05917e73e502f6970'
#     # signed_txn = w3.eth.account.signTransaction(tx, private_key=private_key)

#     # print(signed_txn)


#     #print(signed_txn.HexBytes)
#     #w3.eth.sendRawTransaction(signed_txn.rawTransaction)