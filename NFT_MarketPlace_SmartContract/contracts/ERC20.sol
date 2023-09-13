// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract testERC20 is ERC20("Test USDT","USDT") {
    
    constructor(uint _totalSupply) {
        _mint(msg.sender, _totalSupply);
    }

    function mintToken(uint _amount) public {
        _mint(address(this), _amount);
    }
}