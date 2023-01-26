// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

// this is the interface for subtokens to call from base
// souldboundbase must implement these
interface SoulBoundBaseI {
    function mint(address to_) external returns (uint256);
}
