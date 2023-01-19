//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SoulBoundBaseToken is ERC721EnumerableUpgradeable, AccessControlUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // stores the next tokenid
    CountersUpgradeable.Counter private _tokenIds;

    // operators are able to perform
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    function initialize() public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        __ERC721_init("Test", "TST");
    }

    // since these are soulbound, we prevent any movement of tokens
    // TODO should we allow burning?
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 /*tokenId*/,
        uint256 /*batchSize*/
    ) internal pure override(ERC721EnumerableUpgradeable) {
        require(from == address(0) || to == address(0), "SoulBound cannot be transferred");
    }

    // both ERC721EnumerableUpgradeable and AccessControlUpgradeable implement this
    // so we must override and pass along to them
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721EnumerableUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
