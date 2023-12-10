// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SayHi {
    event MessageLogged(string message);
    // Function to get the message "Hi"
    function getMessage() public {
        string memory message = "Hi from Solidity code";
        emit MessageLogged(message);
    }
}