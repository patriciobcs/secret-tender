import { ethers } from "hardhat";
import { createInstances } from "../instance";
import { getSigners } from "../signers";
import { createTransaction } from "../utils";
import { deploySecretTenderFixture } from "./SecretTender.fixture";
import assert from "assert";

describe("SecretTender", function () {
  before(async function () {
    this.signers = await getSigners(ethers);
  });

  beforeEach(async function () {    
    const secretTenderContract = await deploySecretTenderFixture();
    this.secretTenderAddress = await secretTenderContract.getAddress();
    this.secretTender = secretTenderContract;
    this.secretTenderInstances = await createInstances(this.secretTenderAddress, ethers, this.signers);
  });

  it.only("should create a secret tender", async function () {
    const secretTenderFaucetTransaction = await createTransaction(
      this.secretTender.faucet,
    )
    await secretTenderFaucetTransaction.wait();

    // Create a secret tender
    const encryptedSecretTenderLength = this.secretTenderInstances.alice.encrypt32(5);
    const encryptedSecretTenderAmount = this.secretTenderInstances.alice.encrypt32(10000);

    const secretTenderTransaction = await createTransaction(
      this.secretTender.createTender,
      encryptedSecretTenderLength, encryptedSecretTenderAmount
    );

    await secretTenderTransaction.wait();

    // Create a secret proposal
    const encryptedSecretProposalLength = this.secretTenderInstances.alice.encrypt32(4);
    const encryptedSecretProposalAmount = this.secretTenderInstances.alice.encrypt32(9000);
    const encryptedSecret = this.secretTenderInstances.alice.encrypt32(1234);

    const secretProposalTransaction = await createTransaction(
      this.secretTender.createProposal,
      1, encryptedSecretProposalLength, encryptedSecretProposalAmount, encryptedSecret,
    );
    await secretProposalTransaction.wait();
  });
});
