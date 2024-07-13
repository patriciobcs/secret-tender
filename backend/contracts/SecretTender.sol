// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";
import "./Common.sol";

contract SecretTender is BridgeContract, EIP712WithModifier {
    struct Tender {
        uint256 id; // Unique identifier UUID
        euint32 length; // Max length (days) expected for the proposals
        euint32 amount; // Max amount (USDC) project owner is willing to pay
        uint256 deadline; // Deadline for the proposals to be submitted
        address owner; // Address of the project owner
        Proposal[] proposals; // List of proposals submitted
    }

    struct Proposal {
        uint256 id; // Unique identifier UUID
        uint256 tenderId; // Unique identifier UUID of the tender
        euint32 length; // Length (days) of the proposal
        euint32 amount; // Amount (USDC) of the proposal
        address owner; // Address of the proposal owner
        euint32 secret; // Secret value to be used to revel the proposal after the deadline
    }

    error InsufficientBalance();
    error TenderNotFound();
    error TenderExpired();
    error TenderNotExpired();
    error AmountOrLengthMismatch();

    mapping(address owner => euint32 amount) public balances;
    mapping(uint256 tenderId => Tender tender) public tenders;

    constructor() EIP712WithModifier("Authorization token", "1") {}

    function deposit(address user, uint256 amount) external onlyCallerContract returns (uint256) {
        balances[user] = TFHE.asEuint32(amount);
        return amount;
    }

    function balance() external view returns (uint32) {
        return TFHE.decrypt(balances[msg.sender]);
    }

    function withdraw(euint32 amount) external {
        if (!TFHE.decrypt(TFHE.ge(balances[msg.sender], amount))) revert InsufficientBalance();
        balances[msg.sender] = TFHE.sub(balances[msg.sender], amount);

        // TODO: Bridge back
    }

    function createTender(euint32 amount, euint32 length) external {
        if (!TFHE.decrypt(TFHE.ge(balances[msg.sender], amount))) revert InsufficientBalance();
        balances[msg.sender] = TFHE.sub(balances[msg.sender], amount);

        uint256 id = uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp)));

        tenders[id].id = id;
        tenders[id].length = length;
        tenders[id].amount = amount;
        tenders[id].deadline = block.timestamp + 7 days;
        tenders[id].owner = msg.sender;
    }

    function createProposal(uint256 tenderId, euint32 amount, euint32 length, euint32 secret) external {
        Tender storage tender = tenders[tenderId];
        if (tender.owner == address(0)) revert TenderNotFound();
        if (block.timestamp > tender.deadline) revert TenderExpired();

        if (!TFHE.decrypt(TFHE.and(TFHE.ge(tender.amount, amount), TFHE.le(tender.length, length))))
            revert AmountOrLengthMismatch();

        uint256 id = uint256(keccak256(abi.encodePacked(msg.sender, tenderId)));

        tender.proposals.push(
            Proposal({ id: id, tenderId: tenderId, length: length, amount: amount, owner: msg.sender, secret: secret })
        );
    }

    function revealTenderProposals(uint256 tenderId) external view returns (uint256[] memory) {
        Tender storage tender = tenders[tenderId];
        if (block.timestamp < tender.deadline) revert TenderNotExpired();

        uint256[] memory secrets = new uint256[](tender.proposals.length);

        for (uint256 i = 0; i < tender.proposals.length; i++) {
            Proposal memory proposal = tender.proposals[i];

            secrets[i] = TFHE.decrypt(proposal.secret);
        }

        return secrets;
    }
}
