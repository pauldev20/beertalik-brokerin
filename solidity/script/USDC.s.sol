// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/Party.sol";
import "../src/USDC.sol";
import {Script, console} from "forge-std/Script.sol";

contract FundUSDC is Script {
    function run() public {
        USDC usdc = USDC(0x927fB1414F83905620F460B024bcFf2dD1dA430c);

        // console.log(usdc.balanceOf(0x66664013474a29e9807D1736B1B1123F63345e22));
        vm.startBroadcast();
        usdc.mint(0x646bE080C4900a80472078Ffcf1c2C4f7184957E, 10e6);
        vm.stopBroadcast();
    }
}
