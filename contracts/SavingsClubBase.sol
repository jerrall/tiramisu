//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


/// @title Tiramisue Savings Club v1
/// @author Jerrall, Luis, Mayuko, Prashant
/// @notice This dapp has a single smart contract architecture. It manages state for all savings clubs in this single contract
/// @notice v1 was developed during a short period of time (DappCamp) with the goal of being a MVP. See whitepaper for future roadmap ideas
/// @dev Contraint #1: A user (address) can only belong to a single group
/// @dev Contraint #2: Only one pending request for money can exist at a time per group
abstract contract SavingsClubBase {
    // Store a list of group ids (the indices of this array) and the group owner address (the value at that index)
    address[] public groupOwners;

    mapping(address => uint) public memberToGroupId; // keeps track of which group each user is in
    mapping(uint => address[]) public groupsToMembers; // keeps track of which users are in each group
    mapping(address => string) public memberNames; // store names of users.

    // Index of next member to eligible receive a payout, incremented by 1 after each payout (cycling back to 0)
    mapping(uint => uint) internal nextPayeeIndex;
    mapping(uint => uint) public groupBalances; // stores the balance of each group
    
    mapping(uint => mapping(address => uint)) deposits; // Deposits per address, per group
    mapping(uint => mapping(address => uint)) withdrawals; // Withdrawals per address, per group

    /// Get the human readable name of an address
    /// @param _address member address
    /// @return human readable name
    function getName(address _address) public view returns (string memory) {
        return memberNames[_address];
    }

   /// Get the current balance for a particular group
   /// @param _groupId group id
   /// @return current balance
    function getBalance(uint _groupId) public view validGroupId(_groupId) returns (uint) {
        return groupBalances[_groupId];
    }

    /// Ensure that the group id is valid
    /// @param _groupId The index of the group
    /// @dev Reverts the transaction if the id is invalid
    /// @dev Group at index 0 is not valid
    modifier validGroupId(uint _groupId) {
        require(_groupId >= 0 && _groupId < groupOwners.length, "Inalid group id");
        _;
    }

    /// Get the index of the next payee for a particular group
    /// @param _groupId group id
    /// @return address of the next payee (address currently eligible to call withdraw())
    function getNextPayee(uint _groupId) internal view returns (address) {
        uint _nextPayeeIndex = nextPayeeIndex[_groupId];
        return groupsToMembers[_groupId][_nextPayeeIndex];
    }

    /// Ensure that the address actually belongs to a group
    /// @param _address The address to verify
    /// @param _groupId The group id to check address membership against
    /// @return whether or not the address belongs to this particular group
    /// @dev Loops through all addresses in that group to ensure this address is included
    function addressBelongs(address _address, uint _groupId) internal view returns (bool) {
        address[] storage _groupMembers = groupsToMembers[_groupId];
        for (uint i = 0; i < _groupMembers.length; i++) {
            if (_groupMembers[i] == _address) {
                return true;
            }
        }
        return false;
    }

}
