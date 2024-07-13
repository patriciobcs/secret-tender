import React, { useState } from "react";
import { getInstance, provider } from "./utils/fhevm";
import { toHexString } from "./utils/utils";
import { Contract } from "ethers";
// import tenderingABI from "./abi/tenderingABI";

const CONTRACT_ADDRESS = "0xcA99ef793E76c848Ea1A1B509Df1268BC8cb8d78";

function SubmitProject() {
  const [projectDetails, setProjectDetails] = useState("");
  const [encryptedProject, setEncryptedProject] = useState("");
  const [loading, setLoading] = useState("");
  const [dialog, setDialog] = useState("");

  const handleProjectDetailsChange = (e) => {
    setProjectDetails(e.target.value);
  };

  const submitProject = async (event) => {
    event.preventDefault();
    try {
      const instance = await getInstance();
      const encrypted = instance.encrypt(projectDetails);
      setEncryptedProject(toHexString(encrypted));

      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, tenderingABI, signer);
      setLoading("Encrypting and sending transaction...");
      const transaction = await contract.submitProject(
        "0x" + encryptedProject,
        { gasLimit: 1000000 }
      );
      setLoading("Waiting for transaction validation...");
      await provider.waitForTransaction(transaction.hash);
      setLoading("");
      setDialog("Your project has been submitted!");
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Transaction error!");
    }
  };

  return (
    <div className="mt-5 flex flex-col items-center">
      <h1 className="my-10 text-2xl font-bold text-gray-500">
        Submit a Project
      </h1>
      <form onSubmit={submitProject} className="flex flex-col items-center">
        <textarea
          placeholder="Enter project details"
          value={projectDetails}
          onChange={handleProjectDetailsChange}
          className="border rounded-md px-4 py-2 mb-4 bg-white"
          rows="4"
          cols="50"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-8">
          Submit Project
        </button>
      </form>
      {encryptedProject && (
        <div className="text-gray-500">
          <p>Encrypted Project:</p>
          <div className="overflow-y-auto h-10 flex flex-col">
            <p>{"0x" + encryptedProject.substring(0, 26) + "..."}</p>
          </div>
        </div>
      )}
      <div className="text-gray-500">
        {dialog && <div>{dialog}</div>}
        {loading && <div>{loading}</div>}
      </div>
    </div>
  );
}

export default SubmitProject;
