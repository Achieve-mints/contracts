// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SoulBoundBaseInterface.sol";
import "./SoulBoundSubTokenInterface.sol";

contract AlphaTesterToken is SoulBoundSubTokenI, Ownable {
    SoulBoundBaseI _base;

    mapping(address => bool) public _claimed;
    mapping(uint256 => address) _owners;

    constructor(SoulBoundBaseI base_) {
        _base = base_;
    }

    function mint(address to_) external onlyOwner returns (uint256) {
        require(!_claimed[to_], "already claimed");
        uint256 tokenId = _base.mint(msg.sender);
        _owners[tokenId] = to_;
        _claimed[to_] = true;
        return tokenId;
    }

    function metadata(uint256 tokenId_) external view returns (bytes memory) {
        require(_owners[tokenId_] != address(0x0), "token not found");
        return abi.encode();
    }
}
