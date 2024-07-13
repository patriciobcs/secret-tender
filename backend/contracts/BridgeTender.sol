// SPDX-License-Identifier: Apache-2.0

pragma solidity >=0.8.13 <=0.8.19;

import "./Common.sol";

interface ISecretTender {
    function deposit(address user, uint256 amount) external;
}

contract BridgeTender is BridgeContract {
    mapping (uint256 owner => uint256 deposit) public pendingDeposits;

    error DepositNotExpired();

    // Deposit funds to the SecretTender contract
    function deposit() public payable {
        ISecretTender _secretTender = ISecretTender(secretTender);

        uint256 amount = msg.value;
        uint256 user = uint256(uint160(msg.sender));
        uint256 timestamp = block.timestamp;
        uint256 id = uint256(keccak256(abi.encodePacked(user, timestamp)));

        pendingDeposits[id] = amount;
        bytes memory _callback = abi.encodePacked(this.depositConfirmed.selector, [user, timestamp]);

        IInterchainExecuteRouter(iexRouter).callRemote(
            DestinationDomain,
            address(_secretTender),
            0,
            abi.encodeCall(_secretTender.deposit, (msg.sender, amount)),
            _callback
        );
    }

    // Called by the SecretTender contract, to confirm the deposit (this disable claimPendingDeposit for this deposit)
    function depositConfirmed(uint256 user, uint256 timestamp) external onlyCallerContract {
        uint256 id = uint256(keccak256(abi.encodePacked(user, timestamp)));
        delete pendingDeposits[id];
    }

    // If the bridge contract is not called back within 30 minutes, the user can claim the deposit back
    function claimPendingDeposit(uint256 timestamp) public {
        if (block.timestamp < (timestamp + 30 minutes)) revert DepositNotExpired();
        uint256 id = uint256(keccak256(abi.encodePacked(uint256(uint160(msg.sender)), timestamp)));
        uint256 amount = pendingDeposits[id];
        delete pendingDeposits[id];
        payable(msg.sender).transfer(amount);
    }

    // Called by the SecretTender contract, to withdraw the funds
    function withdraw(address user, uint256 amount) external onlyCallerContract {
        payable(user).transfer(amount);
    }
}