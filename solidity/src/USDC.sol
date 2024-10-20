// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20, Ownable {
    constructor(
        address owner
    ) ERC20("MY USDC", "MUSDC") Ownable(owner) {}

    function decimals() public override pure returns (uint8) {
        return 6;
    }

    function mint(address addr, uint256 amount) external onlyOwner {
        _mint(addr, amount);
    }

    function burn(address addr, uint256 amount) external onlyOwner {
        _burn(addr, amount);
    }
}
