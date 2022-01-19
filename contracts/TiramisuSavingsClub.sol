//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract TiramisuSavingsClub {
    struct Group {
        address[] members;
        string[] names;
        uint owner;
    }

    Group[] public groups;

    mapping(address => uint) public global_memberToGroup; //keeps track of which group each user is in
    mapping(uint => address[]) public groupsToMembers; //keeps track of which users are in each group
    mapping(address => string) public memberNames; //store names of users.

    // Index of next member to receive a payout, incremented by 1 after each payout (cycling back to 0)
    // members[nextPayee] is the only address that can withdraw
    mapping(uint => uint) public nextPayee; //keep track of who's the next payee in each group. 
    mapping(uint => uint) public groupBalances; //stores the amount of money each group has
    
    mapping(uint => mapping(address => uint)) deposits;
    mapping(uint => mapping(address => uint)) withdrawals;

    function createGroup(address[] memory _members, string[] memory _names, uint _owner) public {
        require(_members.length > 0, "Cannot create an empty group");
        require(_members.length == _names.length, "_members and _names length should match");
        require(_owner >= 0 && _owner < _members.length, "_owner index invalid");

        uint id = groups.length;
        groups.push(Group(_members, _names, _owner));

        for (uint i = 0; i < _members.length; i++) {
            address memberAddress = _members[i];
            string memory memberName = _names[i];

            global_memberToGroup[memberAddress] = id;
            groupsToMembers[id] = _members;
            memberNames[memberAddress] = memberName;
        }
    }

    function getName(address user) public view returns (string memory) {
        return memberNames[user];
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}
