// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Simple {
    address public owner;

    // Constructor to set the contract deployer as the owner
    constructor() {
        owner = msg.sender;
    }


    // Function to check if the sender is the owner
    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }
}
