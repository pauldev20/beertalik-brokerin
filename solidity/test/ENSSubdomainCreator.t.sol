// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import "../src/ENSSubdomainCreator.sol";

contract PartyTest is Test {
    ENSSubdomainCreator public creator;

    INameWrapper public wrapper;
    IResolver public resolver;

    string public subdomain;

    function setUp() public {
        wrapper = INameWrapper(0x0635513f179D50A207757E05759CbD106d7dFcE8);
        resolver = IResolver(0x8FADE66B79cC9f707aB26799354482EB93a5B7dD);
        subdomain = "test1";
        creator = new ENSSubdomainCreator(subdomain);
    }

    function computeNameHashParent() public pure returns (bytes32 namehash) {
        namehash = 0x0000000000000000000000000000000000000000000000000000000000000000;
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked("eth")))
        );
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked("beertalik")))
        );
    }

    function computeNameHash(
        string memory _name
    ) public pure returns (bytes32 namehash) {
        namehash = 0x0000000000000000000000000000000000000000000000000000000000000000;
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked("eth")))
        );
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked("beertalik")))
        );
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked(_name)))
        );
    }

    function test_RegisterDomain() public {
        string memory label = "test1";
        address owner = 0x66664013474a29e9807D1736B1B1123F63345e22;
        vm.startPrank(owner);
        wrapper.setSubnodeOwner(
            computeNameHashParent(), // The namehash of the parent node, e.g. "myname.eth"
            label, // The label of the subname to create
            owner, // The address you want to be the owner of the new subname
            0, // The fuse bits OR'd together, that you want to burn
            2021232060 // The expiry for the subname
        );
        resolver.setAddr(computeNameHash(label), address(creator));
        wrapper.setSubnodeRecord(
            computeNameHashParent(), // The namehash of the parent node, e.g. "myname.eth"
            label, // The label of the subname to create
            address(creator), // The address you want to be the owner of the new subname
            address(resolver), // The address of the resolver to set for the new subname
            0, // The TTL to set for the new subname
            0, // The fuse bits OR'd together, that you want to burn
            2021232060 // The expiry for the subname
        );
        creator.registerSubname("subsub", address(0x1337));
        assertEq("subsub.test1.beertalik.eth", creator.getName(address(0x1337)));
    }

}
