//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./SavingsClubBase.sol";

/// @title Tiramisue Savings Club v1
/// @author Jerrall, Luis, Mayuko, Prashant
/// @notice This dapp has a single smart contract architecture. It manages state for all savings clubs in this single contract
/// @notice v1 was developed during a short period of time (DappCamp) with the goal of being a MVP. See whitepaper for future roadmap ideas
/// @dev Contraint #1: A user (address) can only belong to a single group
/// @dev Contraint #2: Only one pending request for money can exist at a time per group
contract TiramisuSavingsClub is SavingsClubBase {

    constructor() {
        // Group id 0 is immediately burned and disallowed for use
        // Otherwise our mapping lookups will be error prone (can't distinguish default value from the group at index 0)
        // First real group will be at index 1
        groupOwners.push(address(0));
    }

    /// Create a savings group
    /// @param _members List of addresses that are members of this goup, sorted by payout order
    /// @param _names List of human readable names that map to addresses - indexed to _members
    /// @param _ownerIndex Index of the address and name of the owner who is allowed to perform special admin functions
    function createGroup(address[] memory _members, string[] memory _names, uint _ownerIndex) public {
        require(_members.length > 0, "Cannot create an empty group");
        require(_members.length == _names.length, "_members and _names length should match");
        require(_ownerIndex >= 0 && _ownerIndex < _members.length, "_owner index invalid");

        uint _groupId = groupOwners.length; // future id of this group
        groupOwners.push(_members[_ownerIndex]);

        for (uint i = 0; i < _members.length; i++) {
            address _memberAddress = _members[i];
            string memory _memberName = _names[i];

            memberToGroupId[_memberAddress] = _groupId;
            groupsToMembers[_groupId] = _members;
            memberNames[_memberAddress] = _memberName;
        }
    }

    function deposit(uint _groupId, uint _amount) validGroupId(_groupId) public payable {
        require(_amount > 0, "Deposit amount must be greater than zero");
        require(addressBelongs(msg.sender, _groupId), "Address does not belong ");
        groupBalances[_groupId] += _amount; // Increment group balance
        deposits[_groupId][msg.sender] += _amount; // Increment contributions by this address
    }

    function withdraw(uint _groupId, uint _amount) validGroupId(_groupId) public {
        require(_amount <= getBalance(_groupId), "Cannot withdraw more than the current balance");
        require(addressBelongs(msg.sender, _groupId), "Address does not belong ");
        require(getNextPayee(_groupId) == msg.sender, "Caller is not the next payee");
        (bool _sent, ) = payable(msg.sender).call{value: _amount}("");
        require(_sent, "Failed to send Ether");

        groupBalances[_groupId] -= _amount; // Decrement group balance
        withdrawals[_groupId][msg.sender] +=_amount; // Increment withdrawals by this address
        nextPayeeIndex[_groupId] = (nextPayeeIndex[_groupId] + 1) % groupsToMembers[_groupId].length; // cycle through addresses, starting back at index 0 when we reach the end of the list
    }

}
