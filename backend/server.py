from flask import Flask, request, jsonify
import subprocess
from dotenv import load_dotenv
import os
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

load_dotenv()
app = Flask(__name__)

RPC_SEPOLIA = "https://sepolia.drpc.org"
RPC_POLYGON_AMOY = "https://polygon-amoy.blockpi.network/v1/rpc/public"
RPC_SKALE = "https://testnet.skalenodes.com/v1/giant-half-dual-testnet"

PRIVATE_KEY = os.environ.get("PRIVATE_KEY")
SENDER_ADDRESS = os.environ.get("ADDRESS")
POLY_USDC_ADDRESS = "0x927fB1414F83905620F460B024bcFf2dD1dA430c"
SKALE_USDC_ADDRESS = "0xdA71C2714017c0CE1E3FC99c2667D9AC0c104150"

web3_sepolia = Web3(Web3.HTTPProvider(RPC_SEPOLIA))
if not web3_sepolia.is_connected():
    print("Failed to connect to Ethereum network")
    exit()

web3_polygon_amoy = Web3(Web3.HTTPProvider(RPC_POLYGON_AMOY))
if not web3_polygon_amoy.is_connected():
    print("Failed to connect to Ethereum network")
    exit()
web3_polygon_amoy.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

web3_skale = Web3(Web3.HTTPProvider(RPC_SKALE))
if not web3_skale.is_connected():
    print("Failed to connect to Ethereum network")
    exit()

ENS_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "label", "type": "string"},
            {"internalType": "address", "name": "a", "type": "address"},
        ],
        "name": "registerSubname",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    }
]
contract_ens = web3_sepolia.eth.contract(
    address="0x927fB1414F83905620F460B024bcFf2dD1dA430c", abi=ENS_ABI
)


USDC_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "addr", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    }
]
usdc_poly_contract = web3_polygon_amoy.eth.contract(address=POLY_USDC_ADDRESS, abi=USDC_ABI)
usdc_skale_contract = web3_skale.eth.contract(address=SKALE_USDC_ADDRESS, abi=USDC_ABI)

@app.route("/register", methods=["POST", "GET"])
def run_register():
    name = request.args.get("name") or request.form.get("name")
    address = request.args.get("address") or request.form.get("address")

    if not name or not address:
        return (
            jsonify(
                {"status": "error", "message": "Missing 'name' or 'address' parameter"}
            ),
            400,
        )

    txn = contract_ens.functions.registerSubname(name, address).build_transaction(
        {
            "from": SENDER_ADDRESS,
            "nonce": web3_sepolia.eth.get_transaction_count(SENDER_ADDRESS),
        }
    )

    signed_txn = web3_sepolia.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
    tx_hash = web3_sepolia.eth.send_raw_transaction(signed_txn.raw_transaction)
    print("0x" + tx_hash.hex())
    return {"status": "ok", "tx": "0x" + tx_hash.hex()}, 200


@app.route("/fund-poly", methods=["POST", "GET"])
def run_fund_poly():
    address = request.args.get("address") or request.form.get("address")

    if not address:
        return (
            jsonify({"status": "error", "message": "Missing 'address' parameter"}),
            400,
        )

    nonce = web3_polygon_amoy.eth.get_transaction_count(SENDER_ADDRESS)
    txn = usdc_poly_contract.functions.mint(address, int(10e6)).build_transaction(
        {
            "from": SENDER_ADDRESS,
            "nonce": nonce,
        }
    )
    signed_txn = web3_polygon_amoy.eth.account.sign_transaction(
        txn, private_key=PRIVATE_KEY
    )
    tx_hash = web3_polygon_amoy.eth.send_raw_transaction(signed_txn.raw_transaction)
    print("0x" + tx_hash.hex())

    amount_in_eth = 0.01  # Adjust as needed
    amount_in_wei = web3_polygon_amoy.to_wei(amount_in_eth, 'ether')

    txn2 = {
        "from": SENDER_ADDRESS,
        'nonce': nonce + 1,
        'gas': 21000,
        'gasPrice': web3_polygon_amoy.to_wei('50', 'gwei'),
        'to': address,
        'value': amount_in_wei,
        'chainId': 80002
    }
    signed_txn2 = web3_polygon_amoy.eth.account.sign_transaction(
        txn2, private_key=PRIVATE_KEY
    )
    tx_hash2 = web3_polygon_amoy.eth.send_raw_transaction(signed_txn2.raw_transaction)
    print("0x" + tx_hash2.hex())

    return {"status": "ok", "tx1": "0x" + tx_hash.hex(), "tx2": "0x" + tx_hash2.hex()}, 200


@app.route("/fund-skale", methods=["POST", "GET"])
def run_fund_skale():
    address = request.args.get("address") or request.form.get("address")

    if not address:
        return (
            jsonify({"status": "error", "message": "Missing 'address' parameter"}),
            400,
        )

    nonce = web3_skale.eth.get_transaction_count(SENDER_ADDRESS)
    txn = usdc_skale_contract.functions.mint(address, int(10e6)).build_transaction(
        {
            "from": SENDER_ADDRESS,
            "nonce": nonce,
        }
    )
    signed_txn = web3_skale.eth.account.sign_transaction(
        txn, private_key=PRIVATE_KEY
    )
    tx_hash = web3_skale.eth.send_raw_transaction(signed_txn.raw_transaction)
    print("0x" + tx_hash.hex())

    amount_in_eth = 0.001 
    amount_in_wei = web3_skale.to_wei(amount_in_eth, 'ether')

    return {"status": "ok", "tx1": "0x" + tx_hash.hex()}, 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1337)
