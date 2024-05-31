// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Multisig.sol";

contract Create2Deployer {
    mapping(address => address[]) public deployedContracts;
    event Deployed(address addr, uint256 salt);

    function deployUsingCreate2(
        bytes memory _bytecode,
        uint256 _salt
    ) public returns (address) {
        address addr;
        assembly {
            addr := create2(0, add(_bytecode, 0x20), mload(_bytecode), _salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        deployedContracts[msg.sender].push(addr);
        emit Deployed(addr, _salt);
        return addr;
    }

    function getDeploymentAddress(
        bytes memory _bytecode,
        uint256 _salt
    ) public view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                _salt,
                keccak256(_bytecode)
            )
        );
        return address(uint160(uint256(hash)));
    }

    function getBytecode(
        address[] memory _owners,
        uint _required
    ) public pure returns (bytes memory) {
        bytes memory bytecode = type(Multisig).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_owners, _required));
    }

    function getDeployedAddresses() public view returns (address[] memory) {
        return deployedContracts[msg.sender];
    }
}
