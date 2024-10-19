// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/ENSSubdomainCreator.sol";
import "../src/USDC.sol";
import {Script, console} from "forge-std/Script.sol";

contract Deploy is Script {
    function run() public {
        // vm.createSelectFork(vm.rpcUrl("sepolia"));

        vm.startBroadcast();
        ENSSubdomainCreator creator = new ENSSubdomainCreator("ethglobal-sf");
        vm.stopBroadcast();
    }
}

contract AddEventDomain is Script {

    INameWrapper public wrapper;
    IResolver public resolver;
    ENSSubdomainCreator public creator;

    function setUp() public {
        wrapper = INameWrapper(0x0635513f179D50A207757E05759CbD106d7dFcE8); 
        resolver = IResolver(0x8FADE66B79cC9f707aB26799354482EB93a5B7dD);
        creator = ENSSubdomainCreator(0x927fB1414F83905620F460B024bcFf2dD1dA430c);
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

    function run() public {
        string memory label = "ethglobal-sf";
        address owner = msg.sender;
        vm.startBroadcast();
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

        // registerSubname(domain, msg.sender);
    }
}

contract AddEventSubDomain is Script {

    ENSSubdomainCreator public creator;

    function setUp() public {
        creator = ENSSubdomainCreator(0x927fB1414F83905620F460B024bcFf2dD1dA430c);
    }

    function run(string memory name, address addr) public {
        vm.broadcast();
        creator.registerSubname(name, address(addr));
    }

}
