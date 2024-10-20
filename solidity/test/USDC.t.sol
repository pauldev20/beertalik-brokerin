// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Party} from "../src/Party.sol";
import {USDC} from "../src/USDC.sol";

contract PartyTest is Test {
    USDC usdc;

    function setUp() public {
        usdc = USDC(0x927fB1414F83905620F460B024bcFf2dD1dA430c);
    }

    function test_transferUSDC() public {
        console.log(usdc.decimals());
        console.log(usdc.totalSupply());
        console.log(usdc.balanceOf(0x66664013474a29e9807D1736B1B1123F63345e22));
        // vm.startPrank(0x66664013474a29e9807D1736B1B1123F63345e22);
        // usdc.transfer(address(0x1337), 10);
        // usdc.mint(address(0x1337), 10);
    }
}
