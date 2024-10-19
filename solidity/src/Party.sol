// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

import {Beer} from "./Beer.sol";

using SafeERC20 for IERC20;

contract Party is Ownable {
    IERC20 public usdc;
    Beer public beer;
    string public name;

    uint256 public minPrice;
    uint256 public buyIncrease;
    uint256 public blockIntervalDecrease;
    uint256 public amountDecrease;

    uint256 private lastPurchasePrice;
    uint256 private lastPurchaseBlockNumber;

    mapping(address => address) nfc;

    event Purchase(address from, uint256 blockNumber, uint256 price);

    /**
     * @param owner The address that will own the contract.
     * @param _name The name of the party.
     * @param _usdc The address of the USDC token contract.
     * @param _minPrice The minimum price (in USDC) required for purchasing of beer.
     * @param _buyIncrease The increase of price whenever someone buys beer.
     * @param _blockIntervalDecrease The number of blocks after which the price will decrease.
     * @param _amountDecrease The amount by which the price will decreases every _blockIntervalDecrease.
     */
    constructor(
        address owner,
        string memory _name,
        address _usdc,
        uint256 _minPrice,
        uint256 _buyIncrease,
        uint256 _blockIntervalDecrease,
        uint256 _amountDecrease
    ) Ownable(owner) {
        name = _name;
        usdc = IERC20(_usdc);
        minPrice = _minPrice;
        buyIncrease = _buyIncrease;
        blockIntervalDecrease = _blockIntervalDecrease;
        amountDecrease = _amountDecrease;
    }

    /**
     *  Gets the current price
     */
    function getPrice() public view returns (uint256) {
        uint256 passedBlocks = block.number - lastPurchaseBlockNumber;
        uint256 timePriceReduction = buyIncrease *
            (passedBlocks / blockIntervalDecrease);
        if (lastPurchasePrice + buyIncrease < timePriceReduction + minPrice) {
            return minPrice;
        }
        return lastPurchasePrice + buyIncrease - timePriceReduction;
    }

    function buy() external {
        uint256 price = getPrice();
        usdc.safeTransferFrom(msg.sender, address(this), price);
        emit Purchase(msg.sender, block.number, price);
        lastPurchasePrice = price;
        lastPurchaseBlockNumber = block.number;
    }

    

    function burnBeer(address nfcAddr, uint256 amount) external onlyOwner {
        address owner = nfc[nfcAddr];
        beer.burn(owner, amount);
    }

    function claimFees() external onlyOwner {
        usdc.transfer(msg.sender, usdc.balanceOf(address(this)));
    }
}
