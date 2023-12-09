// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SayHiContract {
    function getMessage() public pure returns (string memory) {
        return "Hi from Solana that used to be Solidity code!";
    }
}