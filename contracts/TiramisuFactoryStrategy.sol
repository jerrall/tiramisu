//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract TiramisuFactoryStrategy {
    // List of group member addresses, sorted by payout order
    address[] members;

    // Index of next member to receive a payout, incremented by 1 after each payout (cycling back to 0)
    uint public nextPayee = 0;

    mapping(address => uint) public deposits;
    mapping(address => uint) public withdrawals;


    constructor(address[] memory _members) {
        members = _members;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function deposit() public payable {
        deposits[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(_amount <= getBalance(), "Cannot withdraw more than the current balance");
        require(msg.sender == members[nextPayee], "Caller is not the next payee");
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");

        withdrawals[msg.sender] +=_amount;
        nextPayee = (nextPayee + 1) % members.length;
    }

    function dissolve() public {
        // The group owner can dissolve the group, and contributors split the remainder of the funds
    }

}
