// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/PartyList.sol";
import "../src/USDC.sol";
import {Script, console} from "forge-std/Script.sol";

contract Deploy is Script {
    function run() public {
        // vm.createSelectFork(vm.rpcUrl("sepolia"));
        vm.startBroadcast();
        address usdc = address(new USDC(msg.sender));
        new PartyList(usdc);
        vm.stopBroadcast();
    }
}

contract CreateParty is Script {
    function run() public {
        PartyList list = PartyList(0x34163568688fad1086b730FCa9e677aD4D585aa6);

        vm.broadcast();
        list.createParty("ETHGlobal SF");
    }
}
