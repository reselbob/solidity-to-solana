// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SayHi {
    constructor() {
        string memory m = "Hi from Solidity code";
        emit MessageLogged(m);
    }

    event MessageLogged(string message);
}
