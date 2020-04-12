pragma solidity ^0.6.2;

import "./Base.sol";

contract Silver is Base {

    string public symbol = "AGS";
    string public name = "Silver Standard";

    constructor() public {
        fee = 20;
        lastUpdated = 0;

        //Defaults
        burner = msg.sender;
        minter = msg.sender;
        feeHolder = msg.sender;
        paused = false;
    }
}