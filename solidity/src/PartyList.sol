// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Party} from "./Party.sol";

contract PartyList {
    Party[] public parties;
    address public usdc;

    constructor(address _usdc) {
        usdc = _usdc;
    }

    function createParty(string memory name) external {
        Party party = new Party(
            msg.sender,
            name,
            usdc,
            3e6, // min price
            5e5, // buy Increase
            10, // block Interval decrease
            5e5 // amount decrease
        );
        parties.push(party);
    }

    struct PartyData {
        string name;
        address addr;
    }

    function getPartyNames() external view returns (PartyData[] memory) {
        PartyData[] memory partyData = new PartyData[](parties.length);
        for (uint256 i = 0; i < parties.length; i++) {
            partyData[i].name = parties[i].name();
            partyData[i].addr = address(parties[i]);
        }
        return partyData;
    }
}
