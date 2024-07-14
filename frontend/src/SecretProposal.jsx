import React, { useState, useEffect } from "react";
import { getInstance, provider } from "./utils/fhevm";
import { toHexString } from "./utils/utils";
import { Contract } from "ethers";
import secretTenderABI from "./abi/secretTenderABI";

let instance;
const CONTRACT_ADDRESS = "0xF58843e421020155F57211a08D0f0e0E6831806c";

function SecretProposal() {
  const [loading, setLoading] = useState("");
  const [dialog, setDialog] = useState("");
  const [amount, setAmount] = useState(1000);
  const [encryptedAmount, setEncryptedAmount] = useState("");
  const [length, setLength] = useState(5);
  const [encryptedLength, setEncryptedLength] = useState("");
  const [tenderId, setTenderId] = useState(1);

  useEffect(() => {
    async function fetchInstance() {
      instance = await getInstance();
    }
    fetchInstance();
  }, []);

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
    console.log(instance, e.target.value)
    if (instance) {
      const encrypted = instance.encrypt32(Number(e.target.value));
      setEncryptedAmount(toHexString(encrypted));
    }
  };

  const handleLengthChange = (e) => {
    setLength(Number(e.target.value));
    console.log(instance, e.target.value)
    if (instance) {
      const encrypted = instance.encrypt32(Number(e.target.value));
      setEncryptedLength(toHexString(encrypted));
    }
  };

  const createProposal = async (event) => {
    event.preventDefault();
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, secretTenderABI, signer);
      setLoading("Creating proposal...");
      const transaction = await contract.createProposal(
        BigInt(tenderId),
        "0x" + encryptedAmount,
        "0x" + encryptedLength,
        "0x" + encryptedAmount,
      );
      setLoading("Waiting for transaction validation...");
      await provider.waitForTransaction(transaction.hash);
      setLoading("");
      setDialog("Proposal created!");
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Transaction error!");
    }
  };

  return (
    <div className="mt-5">
      <h2>Secret Tender</h2>
      <div>
        <label>
          Tender:
          <input type="number" value={tenderId} onChange={setTenderId} />
        </label>
        <label>
          Amount:
          <input type="number" value={amount} onChange={handleAmountChange} />
        </label>
        <label>
          Length:
          <input type="number" value={length} onChange={handleLengthChange} />
        </label>
      </div>
      <button onClick={createProposal} className="btn btn-primary">
        Create Proposal
      </button>
      {loading && <p>{loading}</p>}
      {dialog && <p>{dialog}</p>}
    </div>
  );
}

export default SecretProposal;
