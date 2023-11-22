
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './ERC5484.sol';
import './access/Ownable.sol';

contract test5484 is ERC5484, Ownable {

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(_msgSender()) {}

    function testMint(address to, uint256 tokenId, BurnAuth state) external onlyOwner() {
        _mintSBT(to, tokenId, state);
    }

    function testBurn(uint256 tokenId) external {
        _burnSBT(tokenId);
    }

}