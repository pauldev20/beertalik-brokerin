# RPC="https://eth-sepolia.api.onfinality.io/public" # sepolia
RPC_SEPOLIA="https://sepolia.drpc.org" # sepolia
RPC="127.0.0.1:8545"
BASE_RPC="https://1rpc.io/base"
POLYGON_AMOY_RPC="https://rpc-amoy.polygon.technology/"

RPC=$(POLYGON_AMOY_RPC)

include .env
export

# --rpc-url $(RPC)

none:

ensSub-deploy:
	forge script script/ENSSubdomainCreator.s.sol:Deploy --broadcast --fork-url $(RPC_SEPOLIA) --private-key $(PRIVATE_KEY) -vvvv --ffi
ensSub-addEventDomain:
	forge script script/ENSSubdomainCreator.s.sol:AddEventDomain --broadcast --fork-url $(RPC_SEPOLIA) --private-key $(PRIVATE_KEY) -vvvv --ffi
ensSub-addEventSubDomain:
	forge script script/ENSSubdomainCreator.s.sol:AddEventSubDomain --broadcast --fork-url $(RPC_SEPOLIA) --private-key $(PRIVATE_KEY) -vvvv --ffi


partyList-deploy:
	forge script script/PartyList.s.sol:Deploy --broadcast --fork-url $(RPC) --private-key $(PRIVATE_KEY) -vvvv --ffi
partyList-verify:
	forge verify-contract \
	0xd32fC62C33C7E359D1E41f87d7C0f24c9f365D5e \
	src/PartyList.sol:PartyList \
	--verifier-url https://api-amoy.polygonscan.com/api/ \
	-e $(POLYSCAN_API_KEY) \
	--rpc-url $(RPC) \
	--guess-constructor-args \
	--chain polygon-amoy \
	--watch


partyList-create-party:
	forge script script/PartyList.s.sol:CreateParty --broadcast --fork-url $(RPC) --private-key $(PRIVATE_KEY) -vvvv --ffi
CONSTRUCTOR_ARGS := $(shell cast abi-encode "constructor(address,string,address,uint256,uint256,uint256,uint256)" $(ADDRESS) "ETHGlobal SF" 0x029b1c31F27a5ae6066cA42ED46F18566f0c8502 3000000 500000 10 500000)
party-verify:
	forge verify-contract \
	0xbA65a69d90E2f9337744dfa365EA3D7064444Fe5 \
	src/Party.sol:Party \
	--verifier-url https://api-amoy.polygonscan.com/api/ \
	-e $(POLYSCAN_API_KEY) \
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

fork:
	anvil -f wss://sepolia.drpc.org
fork-deal:
	curl http://localhost:8545 -X POST -H "Content-Type: application/json" --data '{"method":"anvil_setBalance","params":["$(ADDRESS)", "0x021e19e0c9bab2400000"],"id":1,"jsonrpc":"2.0"}'

.PHONY: test
