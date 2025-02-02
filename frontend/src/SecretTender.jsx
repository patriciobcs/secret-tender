import React, { useState, useEffect } from "react";
import { getInstance, provider } from "./utils/fhevm";
import { toHexString } from "./utils/utils";
import { Contract } from "ethers";
import secretTenderABI from "./abi/secretTenderABI";
import blockscootImage from "../public/blockscout.png";

let instance;
const BLOCKCHAIN_EXPLORER_URL = "https://explorer.testnet.inco.org/tx/";
const CONTRACT_ADDRESS = "0xF58843e421020155F57211a08D0f0e0E6831806c";

function SecretTender() {
  const [loading, setLoading] = useState("");
  const [dialog, setDialog] = useState("");
  const [amount, setAmount] = useState(1000);
  const [encryptedAmount, setEncryptedAmount] = useState("");
  const [length, setLength] = useState(5);
  const [encryptedLength, setEncryptedLength] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  useEffect(() => {
    async function fetchInstance() {
      instance = await getInstance();
    }
    fetchInstance();
  }, []);

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
    console.log(instance, e.target.value);
    if (instance) {
      const encrypted = instance.encrypt32(Number(e.target.value));
      setEncryptedAmount(toHexString(encrypted));
    }
  };

  const handleLengthChange = (e) => {
    setLength(Number(e.target.value));
    console.log(instance, e.target.value);
    if (instance) {
      const encrypted = instance.encrypt32(Number(e.target.value));
      setEncryptedLength(toHexString(encrypted));
    }
  };

  const faucet = async (event) => {
    event.preventDefault();
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, secretTenderABI, signer);
      setLoading("Requesting faucet...");
      const transaction = await contract.faucet();
      setTransactionHash(transaction.hash);
      setLoading("Waiting for transaction validation...");
      await provider.waitForTransaction(transaction.hash);
      setLoading("");
      setDialog("Tokens have been minted!");
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Transaction error!");
      setTransactionHash(""); // Clear transaction hash on error
    }
  };

  const createTender = async (event) => {
    event.preventDefault();
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, secretTenderABI, signer);
      setLoading("Creating tender...");
      const transaction = await contract.createTender(
        "0x" + encryptedAmount,
        "0x" + encryptedLength
      );
      setTransactionHash(transaction.hash);
      setLoading("Waiting for transaction validation...");
      await provider.waitForTransaction(transaction.hash);
      setLoading("");
      setDialog("Tender created!");
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Transaction error!");
      setTransactionHash(""); // Clear transaction hash on error
    }
  };

  return (
    <div className="mt-5">
      <h2>Tender Conditions</h2>
      <div className="form-group">
        <label>
          Budget (USDC):
          <input type="number" value={amount} onChange={handleAmountChange} />
        </label>
      </div>
      <div className="form-group">
        <label>
          Expected Duration (days):
          <input type="number" value={length} onChange={handleLengthChange} />
        </label>
      </div>
      <button onClick={faucet} className="btn btn-primary btn-neon btn-custom">
        Request Faucet
      </button>
      <button
        onClick={createTender}
        className="btn btn-primary btn-thick-border btn-custom">
        Create Tender
      </button>
      {loading && <p>{loading}</p>}
      {dialog && (
        <p>
          {dialog}
          {transactionHash && (
            <>
              <a
                href={`${BLOCKCHAIN_EXPLORER_URL}${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer">
                View on Blockscout Explorer
              </a>
              <a
                href={`${BLOCKCHAIN_EXPLORER_URL}${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer">
                <img
                  src={blockscootImage}
                  alt="Blockchain Explorer"
                  style={{ width: "50px", marginLeft: "10px" }}
                />
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}

export default SecretTender;
