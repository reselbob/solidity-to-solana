pragma solidity ^0.8.0;

contract SayHi {
    constructor() {
        getMessage();
    }

    event MessageLogged(string message);

    function getMessage() public {
        string memory m = "Hi from Solidity code";
        emit MessageLogged(m);
    }
}