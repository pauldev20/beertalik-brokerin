// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Party.sol";
import "../src/USDC.sol";
import {Script, console} from "forge-std/Script.sol";

contract BuyBeer is Script {
    function run() public {
        // vm.createSelectFork(vm.rpcUrl("sepolia"));
        Party party = Party(0x6D2063D32EFacbb20B27cFE1F8683747201d3867);
        USDC usdc = USDC(address(party.usdc()));

        vm.startBroadcast();
        usdc.mint(msg.sender, 10000e6);
        usdc.approve(address(party), 1000e6);
        party.buy();
        party.buy();
        party.buy();
        party.buy();
        party.buy();
        vm.stopBroadcast();
    }
}

contract GetPrice is Script {
    function run() public {
        Party party = Party(0x029b1c31F27a5ae6066cA42ED46F18566f0c8502);
        console.log(party.getPrice());
    }
}
