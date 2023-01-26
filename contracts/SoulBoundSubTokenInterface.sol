// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

// this is the interface for subtokens to call from base
// souldboundbase must implement these
interface SoulBoundSubTokenI {
    // function mint(address to_) external returns (uint256);
    function metadata(uint256 tokenId_) external view returns(bytes memory);
}
