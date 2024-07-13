import React, { useState } from "react";
import { getInstance, provider } from "./utils/fhevm";
import { toHexString } from "./utils/utils";
import { Contract } from "ethers";
// import tenderingABI from "./abi/tenderingABI";

const CONTRACT_ADDRESS = "0xcA99ef793E76c848Ea1A1B509Df1268BC8cb8d78";

function SubmitTender() {
  const [tenderDetails, setTenderDetails] = useState("");
  const [encryptedTender, setEncryptedTender] = useState("");
  const [loading, setLoading] = useState("");
  const [dialog, setDialog] = useState("");

  const handleTenderDetailsChange = (e) => {
    setTenderDetails(e.target.value);
  };

  const submitTender = async (event) => {
    event.preventDefault();
    try {
      const instance = await getInstance();
      const encrypted = instance.encrypt(tenderDetails);
      setEncryptedTender(toHexString(encrypted));

      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, tenderingABI, signer);
      setLoading("Encrypting and sending transaction...");
      const transaction = await contract.submitTender("0x" + encryptedTender, {
        gasLimit: 1000000,
      });
      setLoading("Waiting for transaction validation...");
      await provider.waitForTransaction(transaction.hash);
      setLoading("");
      setDialog("Your tender has been submitted!");
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Transaction error!");
    }
  };

  return (
    <div className="mt-5 flex flex-col items-center">
      <h1 className="my-10 text-2xl font-bold text-gray-500">
        Submit a Tender
      </h1>
      <form onSubmit={submitTender} className="flex flex-col items-center">
        <textarea
          placeholder="Enter tender details"
          value={tenderDetails}
          onChange={handleTenderDetailsChange}
          className="border rounded-md px-4 py-2 mb-4 bg-white"
          rows="4"
          cols="50"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8">
          Submit Tender
        </button>
      </form>
      {encryptedTender && (
        <div className="text-gray-500">
          <p>Encrypted Tender:</p>
          <div className="overflow-y-auto h-10 flex flex-col">
            <p>{"0x" + encryptedTender.substring(0, 26) + "..."}</p>
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

export default SubmitTender;
