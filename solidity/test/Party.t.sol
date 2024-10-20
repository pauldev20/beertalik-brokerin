// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Party} from "../src/Party.sol";
import {USDC} from "../src/USDC.sol";

contract PartyTest is Test {
    USDC usdc;
    Party party;

    uint256 constant startMoney = 10e6;

    uint256 constant minPrice = 3e6;
    uint256 constant buyIncrease = 5e5;
    uint256 constant blockIntervalDecrease = 10;
    uint256 constant amountDecrease = 5e5;

    function setUp() public {
        usdc = new USDC(address(this));
        usdc.mint(address(this), startMoney);
        party = new Party(
            address(this),
            "test1",
            address(usdc),
            minPrice,
            buyIncrease,
            blockIntervalDecrease,
            amountDecrease
        );
        usdc.approve(address(party), startMoney);
    }

    function test_BuyBeer() public {
        vm.roll(100);
        party.buy();
        vm.roll(100000);
        party.buy();
        assertEq(startMoney - 2 * minPrice, usdc.balanceOf(address(this)));
    }

    function test_PriceIncrease() public {
        uint256 price = party.getPrice();
        assertEq(minPrice, price);
        party.buy();
        price = party.getPrice();
        assertEq(minPrice + 5e5, price);
    }

    function test_PriceDecrease() public {
        vm.roll(1);
        party.buy();
        party.buy();
        vm.roll(blockIntervalDecrease);
        uint256 price = party.getPrice();
        assertEq(minPrice + 2 * buyIncrease, price);
        vm.roll(blockIntervalDecrease + 1);
        price = party.getPrice();
        assertEq(minPrice + 2 * buyIncrease - amountDecrease, price);
        vm.roll(2 * blockIntervalDecrease + 1);
        price = party.getPrice();
        assertEq(minPrice + 2 * buyIncrease - 2 * amountDecrease, price);
    }

    function test_NFC() public {
        party.buy();
        party.buy();
        assertEq(2, party.beer().balanceOf(address(this)));
        
        vm.expectRevert();
        party.burnBeer(address(0x1337), 1);

        party.approveNFC(address(0x1337));
        party.burnBeer(address(0x1337), 2);
        assertEq(0, party.beer().balanceOf(address(this)));
    }

    function test_transferOwner() public {
        party.buy();
        party.buy();
        party.approveNFC(address(0x1337));

        party.transferOwnership(address(0x69));

        vm.expectRevert();
        party.burnBeer(address(0x1337), 2);

        vm.prank(address(0x69));
        party.burnBeer(address(0x1337), 2);
    }
}
