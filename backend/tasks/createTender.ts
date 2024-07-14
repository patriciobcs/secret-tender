import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { createInstances } from "../test/instance";
import { Signers, getSigners } from "../test/signers";
import { FhevmInstances } from "../test/types";

task("task:createTender")
  .addParam("length", "Length")
  .addParam("amount", "Amount")
  .addParam("account", "Specify which account [alice, bob, carol, dave]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;
    const SecretTender = await deployments.get("SecretTender");
    const signers = await getSigners(ethers);
    const instances = await createInstances(SecretTender.address, ethers, signers);
    const secretTender = await ethers.getContractAt("SecretTender", SecretTender.address);

    let signer = instances[taskArguments.account as keyof FhevmInstances];
    let length = signer.encrypt32(+taskArguments.length);
    let amount = signer.encrypt32(+taskArguments.amount);

    let res = await secretTender
      .connect(signers[taskArguments.account as keyof Signers])
      .createTender(length, amount);

    console.log("Tender created", (await res.wait())?.hash);
  });
