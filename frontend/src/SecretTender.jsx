import React from "react";
import { useState, useEffect } from "react";
import { getInstance, provider, getTokenSignature } from "./utils/fhevm";
import { Contract } from "ethers";
import secretTenderABI from "./abi/secretTenderABI";

let instance;
const CONTRACT_ADDRESS = "0x1d9b257E124B836B230FD0b015DF50586385F215";

function SecretTender() {
  const [loading, setLoading] = useState("");
  const [dialog, setDialog] = useState("");
  const [amount, setAmount] = useState(0);
  const [encryptedAmount, setEncryptedAmount] = useState("");
  const [length, setLength] = useState(0);
  const [encryptedLength, setEncryptedLength] = useState("");

  useEffect(() => {
    async function fetchInstance() {
      instance = await getInstance();
    }
    fetchInstance();
  }, []);

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
    console.log(instance);
    if (instance) {
      const encrypted = instance.encrypt32(Number(e.target.value));
      setEncryptedAmount(toHexString(encrypted));
    }
  };

  const handleLengthChange = (e) => {
    setLength(Number(e.target.value));
    if (instance) {
      const encrypted = instance.encrypt32(Number(e.target.value));
      setEncryptedLength(toHexString(encrypted));
    }
  }

  const faucet = async (event) => {
    event.preventDefault();
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, secretTenderABI, signer);
      setLoading('Requesting faucet...');
      const transaction = await contract.faucet();
      setLoading("Waiting for transaction validation...");
      await provider.waitForTransaction(transaction.hash);
      setLoading("");
      setDialog("Tokens have been minted!");
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Transaction error!");
    }
  };

  const createTender = async (event) => {
    event.preventDefault();
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, secretTenderABI, signer);
      setLoading('Creating tender...');
      const transaction = await contract.createTender(encryptedAmount, encryptedLength);
      setLoading("Waiting for transaction validation...");
      await provider.waitForTransaction(transaction.hash);
      setLoading("");
      setDialog("Tender created!");
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Transaction error!");
    }
  }

  return (
    <div className="mt-5">
    </div>
  );
}

export default SecretTender;