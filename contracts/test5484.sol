
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import './ERC5484.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract test5484 is ERC5484, Ownable {

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(_msgSender()) {}

    function testMint(address to, uint tokenId) public onlyOwner() {
        _safeMint(to, tokenId);
    }

    function testBurn(uint tokenId) public {
        _burnSbt(tokenId);
    }
    
}