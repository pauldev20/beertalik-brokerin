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
        PartyList list = new PartyList(usdc);
        list.createParty("ethglobal-sf.beertalik.eth"); 
        vm.stopBroadcast();
    }
}

contract CreateParty is Script {
    function run() public {
        PartyList list = PartyList(0xd32fC62C33C7E359D1E41f87d7C0f24c9f365D5e);

        vm.broadcast();
        list.createParty("ethglobal-sf.beertalik.eth");
    }
}
