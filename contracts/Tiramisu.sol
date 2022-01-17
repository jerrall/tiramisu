//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Tiramisu {
    constructor() {

    }

    function createGroup() public {
        // A user can create a group, thereby becoming the group owner
    }

    function contribute() public {
        // A user can contribute money to a group, thereby becoming a contributor to that group
    }

    function request() public {
        // A contributor of a group can make a request
        // requesting an amount up to the total amount of money currently in the group account
        // thereby becoming a requestor
    }

    function voteOnRequest() public {
        // All other contributors of the group must either approve or deny the request within a fixed time period (7 days)
    }

    function dissolve() public {
        // The group owner can dissolve the group, and contributors split the remainder of the funds
    }

}