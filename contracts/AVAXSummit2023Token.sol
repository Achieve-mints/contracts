// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SoulBoundBaseInterface.sol";
import "./SoulBoundSubTokenInterface.sol";

struct AVAXSummit2023MetaData {
    uint256 idx;
}

contract AVAXSummit2023Token is SoulBoundSubTokenI, Ownable {
    SoulBoundBaseI _base;

    mapping(address => mapping(uint256 => bool)) public _claimed;
    mapping(uint256 => address) _owners;

    mapping(uint256 => AVAXSummit2023MetaData) _metadata;

    constructor(SoulBoundBaseI base_) {
        _base = base_;
    }

    event Mint(address indexed to_, uint256 indexed idx_, uint256 indexed tokenId_);

    function mint(address to_, uint256 idx_) external onlyOwner returns (uint256) {
        require(!_claimed[to_][idx_], "already claimed");
        uint256 tokenId = _base.mint(msg.sender);
        _owners[tokenId] = to_;
        _metadata[tokenId] = AVAXSummit2023MetaData(idx_);
        _claimed[to_][idx_] = true;
        emit Mint(to_, idx_, tokenId);
        return tokenId;
    }

    function metadata(uint256 tokenId_) external view returns (bytes memory) {
        require(_owners[tokenId_] != address(0x0), "token not found");
        return abi.encode(_metadata[tokenId_].idx);
    }
}
