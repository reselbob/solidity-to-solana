// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StateStorage {
    uint256 public myNumber; // State variable to store an unsigned integer

    // Function to update the stored number
    function updateNumber(uint256 _newNumber) public {
        myNumber = _newNumber;
    }
}
