// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";
import "./EncryptedERC20.sol";

contract SecretTender is EIP712WithModifier {
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

    error TenderNotFound();
    error TenderExpired();
    error TenderNotExpired();
    error AmountOrLengthMismatch();

    mapping(address owner => euint32 amount) public balances;
    mapping(uint256 tenderId => Tender tender) public tenders;

    EncryptedERC20 public usdc;
    uint256 public tenderCounter = 1;
    uint256 public proposalCounter = 1;

    constructor() EIP712WithModifier("Authorization token", "1") {
        usdc = new EncryptedERC20();
    }

    function faucet() public {
        uint256 amount = 100000;
        euint32 encryptedAmount = TFHE.asEuint32(amount);
        usdc.transfer(msg.sender, encryptedAmount);
    }

    event NewTender(uint256 id, euint32 length, euint32 amount, uint256 deadline, address owner);

    function createTender(bytes calldata encryptedLength, bytes calldata encryptedAmount) public returns (uint256) {
        euint32 amount = TFHE.asEuint32(encryptedAmount);
        euint32 length = TFHE.asEuint32(encryptedLength);
        uint256 id = tenderCounter;
        tenderCounter++;

        tenders[id].id = id;
        tenders[id].length = length;
        tenders[id].amount = amount;
        tenders[id].deadline = block.timestamp + 7 days;
        tenders[id].owner = msg.sender;

        usdc.transfer(address(this), amount);

        emit NewTender(id, length, amount, tenders[id].deadline, msg.sender);

        return id;
    }

    function createProposal(
        uint256 tenderId,
        bytes calldata encryptedamount,
        bytes calldata encryptedLength,
        bytes calldata encryptedSecret
    ) external returns (uint256) {
        Tender storage tender = tenders[tenderId];
        if (tender.owner == address(0)) revert TenderNotFound();
        if (block.timestamp > tender.deadline) revert TenderExpired();

        euint32 amount = TFHE.asEuint32(encryptedamount);
        euint32 length = TFHE.asEuint32(encryptedLength);
        euint32 secret = TFHE.asEuint32(encryptedSecret);

        if (!TFHE.decrypt(TFHE.and(TFHE.ge(tender.amount, amount), TFHE.le(tender.length, length))))
            revert AmountOrLengthMismatch();

        uint256 id = proposalCounter;
        proposalCounter++;

        tender.proposals.push(
            Proposal({ id: id, tenderId: tenderId, length: length, amount: amount, owner: msg.sender, secret: secret })
        );

        return id;
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
