// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Party.sol";
import "../src/USDC.sol";
import {Script, console} from "forge-std/Script.sol";

contract BuyBeer is Script {
    function run() public {
        // vm.createSelectFork(vm.rpcUrl("sepolia"));
        Party party = Party(0xbA65a69d90E2f9337744dfa365EA3D7064444Fe5);
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
        Party party = Party(0xbA65a69d90E2f9337744dfa365EA3D7064444Fe5);
        console.log(party.getPrice());
    }
}
