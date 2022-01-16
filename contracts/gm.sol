//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract gm {
    address owner = msg.sender;

    function greet() public view returns (string memory) {
        if (msg.sender == owner) {
            return "Hello, father";
        }
        return "gm";
    }
}
