//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract TiramisuSavingsClub {
    // List of group member addresses, sorted by payout order
    address[] public members;

    // Index of next member to receive a payout, incremented by 1 after each payout (cycling back to 0)
    // members[nextPayee] is the only address that can withdraw
    uint public nextPayee = 0;

    mapping(address => uint) public deposits;
    mapping(address => uint) public withdrawals;


    constructor(address[] memory _members) {
        members = _members;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Members call this function to "pay their dues"
    function deposit() public payable {
        deposits[msg.sender] += msg.value;
    }

    // Requestors call this function to withdraw their payout, when it is their turn
    function withdraw(uint _amount) public {
        require(_amount <= getBalance(), "Cannot withdraw more than the current balance");
        require(msg.sender == members[nextPayee], "Caller is not the next payee");
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");

        withdrawals[msg.sender] +=_amount;
        nextPayee = (nextPayee + 1) % members.length; // cycle through addresses, starting back at index 0 when we reach the end of the list
    }

    function dissolve() public {
        /**
            - The group owner can dissolve the group
            - For each address:
                - Owed balance = sum of all deposits - sum of all withdrawals (calculated from mappings in storage)
                - If owed balance = 0, this address is settled
                - If owed balance < 0, this address actually owes the protocol $ and is currently a liability to other users
                - If owed balance > 0, the protocol owes this user
            Allocate remaining funds to addresses where owed balance > 0, weighted by how much is owed to them

            This formula works because a savings group is in theory a closed system, with no expectation of profit
            Ideally, the amount of $ you deposited, is the exact same amount you should get back at the end
            If that's not true, then something went wrong.
         */
    }

    function resetGroupMembers(address[] memory _newMembers) public {
        // only owner should be able to call this
        // useful if a member leaves/defaults, or if a new member is added
        members = _newMembers;
    }

}
