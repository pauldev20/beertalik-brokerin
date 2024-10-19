from flask import Flask, request, jsonify
import subprocess
from dotenv import load_dotenv
import os
from web3 import Web3

load_dotenv()
app = Flask(__name__)

RPC_SEPOLIA="https://sepolia.drpc.org"
PRIVATE_KEY=os.environ.get("PRIVATE_KEY")
SENDER_ADDRESS=os.environ.get("ADDRESS")

web3_sepolia = Web3(Web3.HTTPProvider(RPC_SEPOLIA))
if not web3_sepolia.is_connected():
    print("Failed to connect to Ethereum network")
    exit()

contract_abi = [
    {
        "inputs": [
            {"internalType": "string", "name": "label", "type": "string"},
            {"internalType": "address", "name": "a", "type": "address"}
        ],
        "name": "registerSubname",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
contract_ens = web3_sepolia.eth.contract(address="0x927fB1414F83905620F460B024bcFf2dD1dA430c", abi=contract_abi)

# usdc_contract = web3_sepolia.eth.contract(address=USDC_CONTRACT_ADDRESS, abi=[
#         {
#             "constant": False,
#             "inputs": [
#                 {"name": "_to", "type": "address"},
#                 {"name": "_value", "type": "uint256"}
#             ],
#             "name": "transfer",
#             "outputs": [{"name": "", "type": "bool"}],
#             "type": "function"
#         }
#     ])

@app.route('/register', methods=['POST'])
def run_register():
    name = request.args.get('name') or request.form.get('name')
    address = request.args.get('address') or request.form.get('address')

    if not name or not address:
        return jsonify({"status": "error", "message": "Missing 'name' or 'address' parameter"}), 400
    
    txn = contract_ens.functions.registerSubname(name, address).build_transaction({
        'from': SENDER_ADDRESS,
        'nonce': web3_sepolia.eth.get_transaction_count(SENDER_ADDRESS),
    })

    signed_txn = web3_sepolia.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
    tx_hash = web3_sepolia.eth.send_raw_transaction(signed_txn.raw_transaction)
    print('0x' + tx_hash.hex())
    return {"status": "ok", "tx": '0x' + tx_hash.hex()}, 200

@app.route('/fund', methods=['POST'])
def run_fund():
    address = request.args.get('address') or request.form.get('address')

    if not address:
        return jsonify({"status": "error", "message": "Missing 'address' parameter"}), 400
    
    
    # txn = contract.functions.registerSubname(name, address).build_transaction({
    #     'from': SENDER_ADDRESS,
    #     'nonce': web3_sepolia.eth.get_transaction_count(SENDER_ADDRESS),
    # })

    # signed_txn = web3_sepolia.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
    # tx_hash = web3_sepolia.eth.send_raw_transaction(signed_txn.raw_transaction)
    # print('0x' + tx_hash.hex())
    # return {"status": "ok", "tx": '0x' + tx_hash.hex()}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337)
