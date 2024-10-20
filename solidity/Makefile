RPC_SEPOLIA="https://sepolia.drpc.org"
POLYGON_AMOY_RPC="https://rpc-amoy.polygon.technology/"
MORPH_HOLESKY_RPC="https://rpc-quicknode-holesky.morphl2.io/"
FLOW_RPC="https://testnet.evm.nodes.onflow.org"
SKALE_RPC="https://testnet.skalenodes.com/v1/giant-half-dual-testnet"
ZIRCUIT_RPC="https://zircuit1-testnet.liquify.com"

RPC=$(ZIRCUIT_RPC)

include .env
export

# --rpc-url $(RPC)

none:

ensSub-deploy:
	forge script script/ENSSubdomainCreator.s.sol:Deploy --broadcast --fork-url $(RPC_SEPOLIA) --private-key $(PRIVATE_KEY) -vvvv --ffi
ensSub-verify:
	forge verify-contract \
	0x927fB1414F83905620F460B024bcFf2dD1dA430c \
	src/ENSSubdomainCreator.sol:ENSSubdomainCreator \
	-e $(ETHERSCAN_API_KEY) \
	--rpc-url $(RPC_SEPOLIA) \
	--guess-constructor-args \
	--chain sepolia \
	--watch
ensSub-addEventDomain:
	forge script script/ENSSubdomainCreator.s.sol:AddEventDomain --broadcast --fork-url $(RPC_SEPOLIA) --private-key $(PRIVATE_KEY) -vvvv --ffi
ensSub-addEventSubDomain:
	forge script script/ENSSubdomainCreator.s.sol:AddEventSubDomain asd 0x9F79941335e54A11eCD13cedf58375657FdA97A1 --sig 'run(string,address)' --broadcast --fork-url $(RPC_SEPOLIA) --private-key $(PRIVATE_KEY) -vvvv --ffi



partyList-deploy:
	forge script script/PartyList.s.sol:Deploy --broadcast --fork-url $(RPC) --private-key $(PRIVATE_KEY) -vvvv --ffi
CONSTRUCTOR_ARGS := $(shell cast abi-encode "constructor(address)" $(ADDRESS))
usdc-verify:
	forge verify-contract \
	0x927fB1414F83905620F460B024bcFf2dD1dA430c \
	src/USDC.sol:USDC \
	--verifier-url https://api-amoy.polygonscan.com/api/ \
	-e $(POLYSCAN_API_KEY) \
	--rpc-url $(RPC) \
	--guess-constructor-args \
	--chain polygon-amoy \
	--watch
partyList-verify:
	forge verify-contract \
	0x34163568688fad1086b730FCa9e677aD4D585aa6 \
	src/PartyList.sol:PartyList \
	--verifier-url https://api-amoy.polygonscan.com/api/ \
	-e $(POLYSCAN_API_KEY) \
	--rpc-url $(RPC) \
	--guess-constructor-args \
	--chain polygon-amoy \
	--watch


partyList-create-party:
	forge script script/PartyList.s.sol:CreateParty --broadcast --fork-url $(RPC) --private-key $(PRIVATE_KEY) -vvvv --ffi
CONSTRUCTOR_ARGS := $(shell cast abi-encode "constructor(address,string,address,uint256,uint256,uint256,uint256)" $(ADDRESS) "ETHGlobal SF" 0x927fB1414F83905620F460B024bcFf2dD1dA430c 3000000 500000 10 500000)
party-verify:
	forge verify-contract \
	0x6D2063D32EFacbb20B27cFE1F8683747201d3867 \
	src/Party.sol:Party \
	--verifier-url https://api-amoy.polygonscan.com/api/ \
	-e $(POLYSCAN_API_KEY) \
	--rpc-url $(RPC) \
	--constructor-args $(CONSTRUCTOR_ARGS) \
	--chain polygon-amoy \
	--watch
party-verify-morph:
	forge verify-contract \
	0xbA65a69d90E2f9337744dfa365EA3D7064444Fe5 \
	src/Party.sol:Party \
	--verifier-url https://explorer-api-holesky.morphl2.io/api \
	--rpc-url $(RPC) \
	--constructor-args $(CONSTRUCTOR_ARGS) \
	--chain polygon-amoy \
	--watch
party-verify-zircuit:
	forge verify-contract \
	0xbA65a69d90E2f9337744dfa365EA3D7064444Fe5 \
	src/Party.sol:Party \
	--verifier-url https://explorer.testnet.zircuit.com/api/contractVerifyHardhat \
	-e $(ZIRCUIT_API_KEY) \
	--rpc-url $(RPC) \
	--constructor-args $(CONSTRUCTOR_ARGS) \
	--chain polygon-amoy \
	--watch

party-buy-beer:
	forge script script/Party.s.sol:BuyBeer --broadcast --fork-url $(RPC) --private-key $(PRIVATE_KEY) -vvvv --ffi
party-get-price:
	forge script script/Party.s.sol:GetPrice --broadcast --fork-url $(RPC) --private-key $(PRIVATE_KEY) -vvvv --ffi

test:
	forge test --match-test "test_RegisterDomain" --fork-url ${RPC_SEPOLIA} -vvvv

fund:
	forge script script/USDC.s.sol:FundUSDC --broadcast --fork-url $(POLYGON_AMOY_RPC) --private-key $(PRIVATE_KEY) -vvvv --ffi


fork:
	anvil -f wss://sepolia.drpc.org
fork-deal:
	curl http://localhost:8545 -X POST -H "Content-Type: application/json" --data '{"method":"anvil_setBalance","params":["$(ADDRESS)", "0x021e19e0c9bab2400000"],"id":1,"jsonrpc":"2.0"}'

.PHONY: test
