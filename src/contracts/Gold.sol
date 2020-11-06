// SPDX-License-Identifier: MIT
pragma solidity 0.6.0;

import "./Base.sol";

contract Gold is Base {

    function symbol() public pure returns (string memory) {
        return "AUS";
    }

    function name() public pure returns (string memory) {
        return "Gold Standard";
    }

    constructor() public {
        burner = msg.sender;
        minter = msg.sender;
    }
}