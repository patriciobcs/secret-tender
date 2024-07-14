import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { getSigners } from "../test/signers";

task("task:deploySecretTender").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers = await getSigners(ethers);
  const secretTenderFactory = await ethers.getContractFactory("SecretTender");
  const secretTender = await secretTenderFactory.connect(signers.alice).deploy();
  await secretTender.waitForDeployment();
  console.log("SecretTender deployed to: ", await secretTender.getAddress());
});
