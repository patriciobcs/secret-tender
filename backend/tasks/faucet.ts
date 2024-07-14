import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { Signers, getSigners } from "../test/signers";

task("task:faucet")
  .addParam("account", "Specify which account [alice, bob, carol, dave]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;
    const SecretTender = await deployments.get("SecretTender");
    const signers = await getSigners(ethers);
    const secretTender = await ethers.getContractAt("SecretTender", SecretTender.address)

    let res = await secretTender
      .connect(signers[taskArguments.account as keyof Signers])
      .faucet();

    console.log("Faucet received", (await res.wait())?.hash);
  });
