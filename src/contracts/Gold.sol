pragma solidity ^0.4.24;

import "./Base.sol";

contract Gold is Base {

    string public symbol = "AUS";
    string public name = "Gold Standard";

    constructor() public {
        fee = 20;
        lastUpdated = 0;

        //Defaults
        burner = msg.sender;
        minter = msg.sender;
        feeHolder = msg.sender;
    }
}