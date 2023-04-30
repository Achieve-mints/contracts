// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SoulBoundBaseInterface.sol";
import "./SoulBoundSubTokenInterface.sol";

struct ChiknMerchMetadata {
    string code;
}

contract ChiknMerchToken is SoulBoundSubTokenI, Ownable {
    SoulBoundBaseI _base;

    mapping(address => bool) public _claimed;
    mapping(uint256 => ChiknMerchMetadata) _metadata;
    mapping(string => uint256) public _claimCodes;
    mapping(uint256 => address) _owners;

    constructor(SoulBoundBaseI base_) {
        _base = base_;
    }

    function mint(address to_, string memory code_) external onlyOwner returns (uint256) {
        require(!_claimed[to_], "already claimed");
        require(_claimCodes[code_] == 0, "code already claimed");

        uint256 tokenId = _base.mint(to_);
        _owners[tokenId] = to_;
        _metadata[tokenId] = ChiknMerchMetadata(code_);
        _claimCodes[code_] = tokenId;
        _claimed[to_] = true;
        return tokenId;
    }

    function metadata(uint256 tokenId_) external view returns (bytes memory) {
        require(_owners[tokenId_] != address(0x0), "token not found");
        return abi.encode(_metadata[tokenId_].code);
    }
}
