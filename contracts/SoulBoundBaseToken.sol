// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// @title Upgradeable SoulBound base token
// @author Kasumi
contract SoulBoundBaseToken is ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // stores the next tokenid
    CountersUpgradeable.Counter private _tokenIds;

    // operators are able to perform
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    string baseURI = '';

    function initialize() public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        __ERC721_init("Test", "TST");
    }

    // the following functions are overrides for compilation

    // burn token
    function _burn(uint256 tokenId_) internal virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        return super._burn(tokenId_);
    }

    /// @notice Returns the tokenURI for a specific token for 3rd party interfaces and tools
    /// @param tokenId_ The id of the token
    /// @return The URI
    function tokenURI(uint256 tokenId_)
        public
        view
        virtual
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId_);
    }

    // We allow an updateable URI, so we override the default to provide a lookup to our set baseURI value
    function _baseURI() internal view virtual override(ERC721Upgradeable) returns (string memory) {
        return baseURI;
    }

    /// @notice ERC165
    /// @param interfaceId_ The interface id
    /// @return Whether or not we support this interface
    function supportsInterface(bytes4 interfaceId_)
        public
        view
        virtual
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId_);
    }

    // since these are soulbound, we prevent any movement of tokens
    // TODO should we allow burning?
    function _beforeTokenTransfer(
        address from_,
        address to_,
        uint256, /*tokenId*/
        uint256 /*batchSize*/
    ) internal pure override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        require(from_ == address(0) || to_ == address(0), "SoulBound cannot be transferred");
    }

    /// @notice Defines the baseURI for all subsequent uri lookups
    /// @param baseURI_ The new baseURI
    function setBaseURI(string memory baseURI_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = baseURI_;
    }
}
