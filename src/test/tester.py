from web3 import Web3
import json

# #node_url = "https://ropsten.infura.io/v3/"

# Rinkeby .105, Ropsten .127, Main .104 
# node_url = "http://192.168.1.105:8545"
# node_url = "http://192.168.1.104:8545"
node_url = "http://192.168.1.127:8545"

web3 = Web3(Web3.HTTPProvider(node_url))

# test connection to geth / besu
print(web3.isConnected())
print(web3.eth.blockNumber)

owner = "0xa1138fccd5f8e126e8d779cf78a547517307559d"
#balance = web3.eth.getBalance(owner)
#print(balance)

address = "0xa801C4029738fF86e5e3076c216fDcce56ec30dB"
# 
# #balance = web3.eth.getBalance("ddemonstrate.eth")

with open("../build/contracts/Gold.json", "r") as f:
    _json = json.load(f)
    #print(_json["abi"])
    abi = _json["abi"]

    print(abi)

    #myContract = web3.eth.contract(address=contract_address, abi=contract_abi)
    #twentyone = myContract.functions.multiply7(3).call()
    
    contract = web3.eth.contract(address=address, abi=abi)
    ts = contract.functions.totalSupply().call()