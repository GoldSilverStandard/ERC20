pragma solidity 0.6.4;

import "./Base.sol";

contract Silver is Base {

    function symbol() public pure returns (string memory) {
        return "AGS";
    }

    function name() public pure returns (string memory) {
        return "Silver Standard";
    }

    constructor() public {
        fee = 20;
        _lastUpdated = 0;

        //Defaults
        burner = msg.sender;
        minter = msg.sender;
        feeHolder = msg.sender;
        paused = false;
    }
}