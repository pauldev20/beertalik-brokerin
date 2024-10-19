// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {ERC1155Holder} from "../lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol";

interface INameWrapper {
    function setSubnodeOwner(
        bytes32 parentNode,
        string calldata label,
        address owner,
        uint32 fuses,
        uint64 expiry
    ) external;
    function setSubnodeRecord(
        bytes32 parentNode,
        string calldata label,
        address owner,
        address resolver,
        uint64 ttl,
        uint32 fuses,
        uint64 expiry
    ) external;
}

interface IResolver {
    function setAddr(bytes32 node, address a) external;
}

contract ENSSubdomainCreator is ERC1155Holder {
    INameWrapper public immutable wrapper;
    IResolver public immutable resolver;
    string public ensName;

    constructor(string memory _ensName) {
        wrapper = INameWrapper(0x0635513f179D50A207757E05759CbD106d7dFcE8); //_wrapper;
        resolver = IResolver(0x8FADE66B79cC9f707aB26799354482EB93a5B7dD); //_resolver;
        ensName = _ensName;
    }

    function computeNameHashParent() public view returns (bytes32 namehash) {
        namehash = 0x0000000000000000000000000000000000000000000000000000000000000000;
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked("eth")))
        );
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked("beertalik")))
        );
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked(ensName)))
        );
    }

    function computeNameHash(
        string memory _name
    ) public view returns (bytes32 namehash) {
        namehash = 0x0000000000000000000000000000000000000000000000000000000000000000;
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked("eth")))
        );
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked("beertalik")))
        );
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked(ensName)))
        );
        namehash = keccak256(
            abi.encodePacked(namehash, keccak256(abi.encodePacked(_name)))
        );
    }

    function registerSubname(string calldata label, address a) public {
        wrapper.setSubnodeOwner(
            computeNameHashParent(), // The namehash of the parent node, e.g. "myname.eth"
            label, // The label of the subname to create
            address(this), // The address you want to be the owner of the new subname
            0, // The fuse bits OR'd together, that you want to burn
            2021232060 // The expiry for the subname
        );
        resolver.setAddr(computeNameHash(label), a);
        wrapper.setSubnodeRecord(
            computeNameHashParent(), // The namehash of the parent node, e.g. "myname.eth"
            label, // The label of the subname to create
            address(this), // The address you want to be the owner of the new subname
            address(resolver), // The address of the resolver to set for the new subname
            0, // The TTL to set for the new subname
            0, // The fuse bits OR'd together, that you want to burn
            2021232060 // The expiry for the subname
        );
    }
}
