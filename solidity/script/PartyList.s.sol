// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/PartyList.sol";
import "../src/USDC.sol";
import {Script, console} from "forge-std/Script.sol";

contract Deploy is Script {
    function run() public {
        // vm.createSelectFork(vm.rpcUrl("sepolia"));
        vm.startBroadcast();
        // address usdc = address(new USDC(msg.sender));
        new PartyList(0x029b1c31F27a5ae6066cA42ED46F18566f0c8502);
        vm.stopBroadcast();
    }
}

contract CreateParty is Script {
    function run() public {
        PartyList list = PartyList(0xd32fC62C33C7E359D1E41f87d7C0f24c9f365D5e);

        vm.broadcast();
        list.createParty("ETHGlobal SF");
    }
}
