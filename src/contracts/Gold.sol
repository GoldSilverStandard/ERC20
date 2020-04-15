pragma solidity ^0.6.2;

import "./Base.sol";

contract Gold is Base {

    function symbol() public pure returns (string memory) {
        return "AUS";
    }

    function name() public pure returns (string memory) {
        return "Gold Standard";
    }

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