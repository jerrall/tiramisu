//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


/// @title Tiramisu Savings Club v1
/// @author Jerrall, Luis, Mayuko, Prashant
/// @notice This dapp has a single smart contract architecture. It manages state for all savings clubs in this single contract
/// @notice v1 was developed during a short period of time (DappCamp) with the goal of being a MVP. See whitepaper for future roadmap ideas
/// @dev Contraint #1: A user (address) can only belong to a single group
/// @dev Contraint #2: Only one pending request for money can exist at a time per group
contract TiramisuSavingsClub {
    // Store a list of group ids (the indices of this array) and the group owner address (the value at that index)
    address[] public groupOwners;

    mapping(address => uint) public memberToGroupId; // keeps track of which group each user is in
    mapping(uint => address[]) public groupsToMembers; // keeps track of which users are in each group
    mapping(address => string) public memberNames; // store names of users.

    // Index of next member to eligible receive a payout, incremented by 1 after each payout (cycling back to 0)
    mapping(uint => uint) public nextPayeeIndex;
    mapping(uint => uint) public groupBalances; // stores the balance of each group
    
    mapping(uint => mapping(address => uint)) deposits; // Deposits per address, per group
    mapping(uint => mapping(address => uint)) withdrawals; // Withdrawals per address, per group

    constructor() {
        // Group id 0 is immediately burned and disallowed for use
        // Otherwise our mapping lookups will be error prone (can't distinguish default value from the group at index 0)
        // First real group will be at index 1
        groupOwners.push(address(0));
    }

    /// Ensure that the group id is valid
    /// @param _groupId The index of the group
    /// @dev Reverts the transaction if the id is invalid
    /// @dev Group at index 0 is not valid
    modifier validGroupId(uint _groupId) {
        require(_groupId >= 0 && _groupId < groupOwners.length, "Inalid group id");
        _;
    }

    /// Create a savings group
    /// @param _members List of addresses that are members of this goup, sorted by payout order
    /// @param _names List of human readable names that map to addresses - indexed to _members
    /// @param _ownerIndex Index of the address and name of the owner who is allowed to perform special admin functions
    /// @return group id
    function createGroup(address[] memory _members, string[] memory _names, uint _ownerIndex) public returns (uint) {
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
        return _groupId;
    }

    /// Deposit a payment into a savings group
    /// @param _groupId The index of the group you want to deposit into
    /// @dev Reverts if _groupId is not valid
    /// @dev Reverts if _amount is not positive
    /// @dev Reverts if msg.sender does not belong to this group
    function deposit(uint _groupId) validGroupId(_groupId) public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        require(addressBelongs(msg.sender, _groupId), "Address does not belong ");
        groupBalances[_groupId] += msg.value; // Increment group balance
        deposits[_groupId][msg.sender] += msg.value; // Increment contributions by this address
    }

    /// Withdraw funds from a savings group
    /// @notice Only the next payee is allowed to withdraw at any point in time. Transaction will fail if it's not your turn
    /// @param _groupId The index of the group you want to deposit into
    /// @param _amount The amount of ether you want to withdraw (wei)
    /// @dev Reverts if _groupId is not valid
    /// @dev Reverts if you attempt to withdraw more than your saving group balance
    /// @dev Reverts if _amount is not positive
    /// @dev Reverts if msg.sender does not belong to this group
    /// @dev Reverts if the caller is not the next payee (not your turn)
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

    /// Dissolve savings group and return funds
    /// @notice Delete state from your savings club, and disburse remaining funds
    /// @notice WARNING - disburse funds functionality not implemented yet 
    /// @param _groupId The index of the group you want to deposit into
    /// @dev Reverts if _groupId is not valid
    /// @dev Reverts if caller is not the group owner
    function dissolve(uint _groupId) validGroupId(_groupId) public {
        require(msg.sender == groupOwners[_groupId], "Caller is not the group owner");

        // TODO: Need to implement the functionality to disburse the remaining funds fairly

        address[] storage _members = groupsToMembers[_groupId];
        for (uint i = 0; i < _members.length; i++) {
            address _memberAddress = _members[i];

            delete memberToGroupId[_memberAddress];
            delete memberNames[_memberAddress];

            delete deposits[_groupId][_memberAddress];
            delete withdrawals[_groupId][_memberAddress];
        }

        delete groupOwners[_groupId];
        delete groupsToMembers[_groupId];
        delete nextPayeeIndex[_groupId];
        delete groupBalances[_groupId];
 
    }

    /// Ensure that the address actually belongs to a group
    /// @param _address The address to verify
    /// @param _groupId The group id to check address membership against
    /// @return whether or not the address belongs to this particular group
    /// @dev Loops through all addresses in that group to ensure this address is included
    function addressBelongs(address _address, uint _groupId) private view returns (bool) {
        address[] storage _groupMembers = groupsToMembers[_groupId];
        for (uint i = 0; i < _groupMembers.length; i++) {
            if (_groupMembers[i] == _address) {
                return true;
            }
        }
        return false;
    }

    /// Get the group id that this address belongs to
    /// @param _address The address for whom we want to fetch groupId
    /// @return the id of the group that this address belongs
    /// @dev If this address does not belong to a group, the transaction is reverted
    /// @dev If this address belongs to a non-existing group, the transaction is reverted
    function getGroupId(address _address) private view returns (uint) {
        uint _groupId = memberToGroupId[_address];
        require(_groupId > 0, "Address does not belong to any group"); // index 0 is special and known garbage (see constructor)
        require(_groupId < groupOwners.length, "Invalid group id");
        return _groupId;
    }

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

    /// Get the index of the next payee for a particular group
    /// @param _groupId group id
    /// @return index of the next payee (address currently eligible to call withdraw())
    function getNextPayee(uint _groupId) public view returns (address) {
        uint _nextPayeeIndex = nextPayeeIndex[_groupId];
        return groupsToMembers[_groupId][_nextPayeeIndex];
    }
}
