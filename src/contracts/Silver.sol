// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Base.sol";

contract Silver is Base {

    function symbol() public pure returns (string memory) {
        return "AGS";
    }

    function name() public pure returns (string memory) {
        return "Silver Standard";
    }

    constructor() public {
        burner = msg.sender;
        minter = msg.sender;
    }
}