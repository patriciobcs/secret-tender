import { ethers } from "hardhat";

import type { SecretTender } from "../../types";
import { getSigners } from "../signers";

export async function deploySecretTenderFixture(): Promise<SecretTender> {
  const signers = await getSigners(ethers);

  const contractFactory = await ethers.getContractFactory("SecretTender");
  const contract = await contractFactory.connect(signers.alice).deploy();
  await contract.waitForDeployment();

  return contract;
}
