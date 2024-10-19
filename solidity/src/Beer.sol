// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract Beer is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        address owner
    ) ERC20(name, symbol) Ownable(owner) {}

    function decimals() public override pure returns (uint8) {
        return 0;
    }

    function mint(address addr, uint256 amount) external onlyOwner {
        _mint(addr, amount);
    }

    function burn(address addr, uint256 amount) external onlyOwner {
        _burn(addr, amount);
    }
}
