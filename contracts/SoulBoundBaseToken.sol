// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./SoulBoundBaseInterface.sol";
import "./SoulBoundSubTokenInterface.sol";

// @title Upgradeable SoulBound base token
// @author Kasumi
// access control is used for DEFAULT_ADMIN_ROLE, allowing safe(r) transfer of ownership
// TODO uriStorage is maybe not needed, included in case (some subtokens may want to modify these?)
contract SoulBoundBaseToken is
    SoulBoundBaseI,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // stores the next tokenid
    CountersUpgradeable.Counter private _tokenIds;

    string _customBaseURI;

    mapping(address => bool) public _subTokensEnabled;
    mapping(uint256 => address) public _tokenIdToSubtoken;

    modifier onlySubToken() {
        require(_subTokensEnabled[msg.sender], "subtoken not enabled");
        _;
    }

    /// @notice Event emitted when a sub token is enabled or disabled
    /// @param impl_ The address of the subtoken
    /// @param enabled_ The address of the subtoken
    event SubTokenStatusChange(address indexed impl_, bool enabled_);

    /// @notice Event emitted when a new token is minted
    /// @param to_ The address of the owner of the token
    /// @param subtoken_ The subtoken type
    /// @param tokenId_ The id of the token
    event Mint(address indexed to_, address indexed subtoken_, uint256 indexed tokenId_);

    // @notice This is the constructor for upgradeable contracts
    function initialize() public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        __ERC721_init("Test", "TST");
    }

    /// @notice Only subtokens may call mint, they can process and store additional metadata using the returned newItemId
    /// @param to_ The address of the owner of the newly minted token
    /// @return The tokenId for this newly minted nft
    function mint(address to_) external onlySubToken returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _tokenIdToSubtoken[newItemId] = msg.sender;
        _mint(to_, newItemId);
        emit Mint(to_, msg.sender, newItemId);
        return newItemId;
    }

    /// @notice Tokens are of different types of subtokens. This enables the admins to turn on/off which are allowed to mint.
    /// @param impl_ The address of the subtoken
    /// @param enabled_ The address of the subtoken
    function setSubToken(address impl_, bool enabled_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _subTokensEnabled[impl_] = enabled_;
        emit SubTokenStatusChange(impl_, enabled_);
    }

    /// @notice Retrieves the metadata provided by the subtoken. Note: this will be different format dependig on the subtoken.
    /// @param tokenId_ The tokenId
    /// @return The encoded metadata
    function metadata(uint256 tokenId_) external view returns (bytes memory) {
        require(_tokenIdToSubtoken[tokenId_] != address(0x0), "subtoken not found");
        SoulBoundSubTokenI subtoken = SoulBoundSubTokenI(_tokenIdToSubtoken[tokenId_]);
        return subtoken.metadata(tokenId_);
    }

    /// @notice Defines the baseURI for all subsequent uri lookups
    /// @param baseURI_ The new baseURI
    function setBaseURI(string memory baseURI_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _customBaseURI = baseURI_;
    }

    /// @notice We allow an updateable URI, so we override the default to provide a lookup to our set baseURI value
    /// @return The custom baseURI the admins have set
    function _baseURI() internal view virtual override(ERC721Upgradeable) returns (string memory) {
        return _customBaseURI;
    }

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

    /// @notice since these are soulbound, we prevent any movement of tokens
    /// @dev TODO should we allow burning? tokenId & batchSize not used
    /// @param from_ The sender
    /// @param to_ The receiver
    function _beforeTokenTransfer(
        address from_,
        address to_,
        uint256, /*tokenId*/
        uint256 /*batchSize*/
    ) internal pure override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        require(from_ == address(0) || to_ == address(0), "SoulBound cannot be transferred");
    }
}
