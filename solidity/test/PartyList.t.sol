// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {PartyList} from "../src/PartyList.sol";

contract PartyListTest is Test {
    PartyList list;

    function setUp() public {
        list = new PartyList();
    }

    function test_CreateParty() public {
        list.createParty("test1");
    }

    function test_PartyData() public {
        list.createParty("test1");
        list.createParty("test2");
        PartyList.PartyData[] memory parties = list.getPartyNames(); 
        assertEq("test1", parties[0].name);
        assertEq("test2", parties[1].name);
        assertNotEq(address(0), parties[0].addr);
        assertNotEq(address(0), parties[1].addr);
    }
}
