// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { IRouterClient } from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import { Client } from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

// import "hardhat/console.sol";

contract Multisig {
    error NotEnoughBalanceForFees(
        uint256 currentBalance,
        uint256 calculatedFees
    );
    error NotEnoughBalanceUsdcForTransfer(uint256 currentBalance);
    error NothingToWithdraw();

    address[] public owners;
    uint public required;
    uint public transactionCount;

    mapping(address => bool) public isOwner;

    struct Transaction {
        address to;
        IERC20 token;
        uint value;
        bytes data;
        bool executed;
        uint confirmations;
        IERC20 linkToken;
        uint64 destinationChainSelector;
        address ccipRouter;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    event Deposit(address indexed sender, uint value);
    event TransactionSubmitted(uint indexed transactionId);
    event TransactionConfirmed(
        address indexed owner,
        uint indexed transactionId
    );
    event TransactionExecuted(uint indexed transactionId);
    event TransactionExecutionFailed(uint indexed transactionId);
    event RevokeConfirmation(address indexed owner, uint indexed transactionId);
    event CCIPTransferred(
        bytes32 messageId,
        uint64 destinationChainSelector,
        address receiver,
        uint256 amount,
        uint256 ccipFee
    );

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not owner");
        _;
    }

    modifier transactionExists(uint _transactionId) {
        require(
            _transactionId < transactionCount,
            "Transaction does not exist"
        );
        _;
    }

    modifier notExecuted(uint _transactionId) {
        require(
            !transactions[_transactionId].executed,
            "Transaction already executed"
        );
        _;
    }

    modifier notConfirmed(uint _transactionId) {
        require(
            !confirmations[_transactionId][msg.sender],
            "Transaction already confirmed"
        );
        _;
    }

    // Constructor
    constructor(address[] memory _owners, uint _required) payable {
        require(_owners.length > 0, "Owners required");
        require(
            _required > 0 && _required <= _owners.length,
            "Invalid number of required confirmations"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }
        required = _required;
    }

    // Fallback function to receive Ether
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // TODO: Implement the following functions
    function submitAndConfirmTransaction() public onlyOwner {}

    function executeSplitTransaction() public onlyOwner {}

    // Submit a transaction
    function submitTransaction(
        address _to,
        IERC20 _token,
        uint _value,
        bytes memory _data,
        IERC20 _linkToken,
        uint64 _destinationChainSelector,
        address _ccipRouter
    ) public onlyOwner {
        uint transactionId = transactionCount++;
        transactions[transactionId] = Transaction({
            to: _to,
            token: _token,
            value: _value,
            data: _data,
            executed: false,
            confirmations: 0,
            linkToken: _linkToken,
            destinationChainSelector: _destinationChainSelector,
            ccipRouter: _ccipRouter
        });

        emit TransactionSubmitted(transactionId);
    }

    // Confirm a transaction
    function confirmTransaction(
        uint _transactionId
    )
        public
        onlyOwner
        transactionExists(_transactionId)
        notExecuted(_transactionId)
        notConfirmed(_transactionId)
    {
        confirmations[_transactionId][msg.sender] = true;
        transactions[_transactionId].confirmations += 1;

        emit TransactionConfirmed(msg.sender, _transactionId);

        if (transactions[_transactionId].confirmations >= required) {
            Transaction storage txn = transactions[_transactionId];
            if (
                txn.linkToken != IERC20(address(0)) &&
                txn.ccipRouter != address(0)
            ) {
                transferCCIP(
                    _transactionId,
                    txn.to,
                    txn.value,
                    IERC20(txn.token),
                    txn.linkToken,
                    txn.destinationChainSelector,
                    txn.ccipRouter
                );
            } else {
                executeTransaction(_transactionId);
            }
        }
    }

    // Execute a transaction
    function executeTransaction(
        uint _transactionId
    )
        public
        onlyOwner
        transactionExists(_transactionId)
        notExecuted(_transactionId)
    {
        require(
            transactions[_transactionId].confirmations >= required,
            "Not enough confirmations"
        );

        Transaction storage txn = transactions[_transactionId];
        txn.executed = true;

        if (address(txn.token) == address(this)) {
            require(
                address(this).balance >= txn.value,
                "Insufficient contract balance"
            );
            (bool success, ) = txn.to.call{ value: txn.value }(txn.data);
            require(success, "Transaction execution failed");
        } else {
            require(
                IERC20(txn.token).transfer(txn.to, txn.value),
                "Token transfer failed"
            );
        }

        emit TransactionExecuted(_transactionId);
    }

    function revokeConfirmation(
        uint _transactionId
    )
        public
        onlyOwner
        transactionExists(_transactionId)
        notExecuted(_transactionId)
    {
        Transaction storage transaction = transactions[_transactionId];

        require(confirmations[_transactionId][msg.sender], "tx not confirmed");

        transaction.confirmations -= 1;
        confirmations[_transactionId][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _transactionId);
    }

    function transferCCIP(
        uint _transactionId,
        address _receiver,
        uint256 _amount,
        IERC20 _token,
        IERC20 _linkToken,
        uint64 _destinationChainSelector,
        address _ccipRouter
    ) public returns (bytes32 messageId) {
        IRouterClient ccipRouter = IRouterClient(_ccipRouter);

        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: address(_token),
            amount: _amount
        });
        tokenAmounts[0] = tokenAmount;

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({ gasLimit: 0 })
            ),
            feeToken: address(_linkToken)
        });

        uint256 ccipFee = ccipRouter.getFee(_destinationChainSelector, message);

        if (ccipFee > _linkToken.balanceOf(address(this)))
            revert NotEnoughBalanceForFees(
                _linkToken.balanceOf(address(this)),
                ccipFee
            );
        _linkToken.approve(address(ccipRouter), ccipFee);

        // TODO: LOGIC TO TRANSFER FROM THIS CONTRACT INSTEAD OF MSG.SENDER
        // if (_amount > _token.balanceOf(msg.sender))
        //     revert NotEnoughBalanceUsdcForTransfer(
        //         _token.balanceOf(msg.sender)
        //     );
        // _token.transferFrom(msg.sender, address(this), _amount);
        _token.approve(address(ccipRouter), _amount);

        // Send CCIP Message
        messageId = ccipRouter.ccipSend(_destinationChainSelector, message);

        Transaction storage txn = transactions[_transactionId];
        txn.executed = true;

        emit CCIPTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _amount,
            ccipFee
        );
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint) {
        return transactionCount;
    }

    function getTransaction(
        uint _transactionId
    )
        public
        view
        returns (
            address to,
            IERC20 token,
            uint value,
            bytes memory data,
            bool executed,
            uint numConfirmations,
            IERC20 linkToken,
            uint64 destinationChainSelector,
            address ccipRouter
        )
    {
        Transaction storage transaction = transactions[_transactionId];

        return (
            transaction.to,
            transaction.token,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.confirmations,
            transaction.linkToken,
            transaction.destinationChainSelector,
            transaction.ccipRouter
        );
    }

    // Check if a transaction is confirmed by an owner
    function isConfirmed(
        uint _transactionId,
        address _owner
    ) public view returns (bool) {
        return confirmations[_transactionId][_owner];
    }
}
