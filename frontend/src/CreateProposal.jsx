import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import lighthouse from "@lighthouse-web3/sdk";
import "./SecretInput.css";
import SecretProposal from "./SecretProposal";

function CreateProposal() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [description, setDescription] = useState("");
  const [whoCanApply, setWhoCanApply] = useState("");
  const [whenRevealed, setWhenRevealed] = useState("");
  const [whoCanSeeIt, setWhoCanSeeIt] = useState("");
  const [currency, setCurrency] = useState("");
  const [howMuch, setHowMuch] = useState("");
  const [whichChain, setWhichChain] = useState("");
  const [whichAddress, setWhichAddress] = useState("");
  const [cid, setCid] = useState(""); // New state for CID

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    exportJson();
  };

  const exportJson = () => {
    const formData = {
      name,
      goal,
      description,
      whoCanApply,
      whenRevealed,
      whoCanSeeIt,
      currency,
      howMuch,
      whichChain,
      whichAddress,
    };

    const json = JSON.stringify(formData, null, 2);

    // Create and download JSON file locally
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formData.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    const formData = {
      name,
      goal,
      description,
      whoCanApply,
      whenRevealed,
      whoCanSeeIt,
      currency,
      howMuch,
      whichChain,
      whichAddress,
    };

    const json = JSON.stringify(formData, null, 2);

    // Create a FormData object to handle file uploads in the browser
    const formDataUpload = new FormData();
    const blob = new Blob([json], { type: "application/json" });
    formDataUpload.append("file", blob, "formData.json");

    // Upload JSON file to Filecoin using Lighthouse
    try {
      const apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY; // Replace with your actual API key
      console.log(apiKey); // For debugging
      const response = await lighthouse.uploadText(json, apiKey);
      console.log(response);
      setCid(response.data.Hash); // Set the CID state
      alert(`File uploaded successfully! CID: ${response.data.Hash}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="secret-tender-container">
      <h1>
        Welcome to <span className="highlight">Secret Tender</span>
      </h1>
      <span className="footer">
        Switch to Inco Gentry Testnet on Metamask:{" "}
        <a
          href="https://docs.inco.network/getting-started/connect-metamask"
          target="_blank"
          rel="noopener noreferrer">
          Guide
        </a>
      </span>
      <Form className="form-container" onSubmit={handleSubmit}>
        <div className="section">
          <Form.Control
            type="text"
            value={name}
            onChange={handleInputChange(setName)}
            className="input mb-3"
            placeholder="Name"
          />
          <Form.Control
            type="text"
            value={goal}
            onChange={handleInputChange(setGoal)}
            className="input mb-3"
            placeholder="Goal"
          />
          <Form.Control
            type="text"
            value={description}
            onChange={handleInputChange(setDescription)}
            className="input mb-3"
            placeholder="Describe"
          />
          <Form.Control
            type="text"
            value={whoCanApply}
            onChange={handleInputChange(setWhoCanApply)}
            className="input mb-3"
            placeholder="Who Can Apply"
          />
        </div>

        <div className="section">
          <Form.Control
            type="text"
            value={whenRevealed}
            onChange={handleInputChange(setWhenRevealed)}
            className="input mb-3"
            placeholder="When Revealed"
          />
          <Form.Control
            type="text"
            value={whoCanSeeIt}
            onChange={handleInputChange(setWhoCanSeeIt)}
            className="input mb-3"
            placeholder="Who Can See It"
          />
          <Form.Control
            type="text"
            value={currency}
            onChange={handleInputChange(setCurrency)}
            className="input mb-3"
            placeholder="What Currency"
          />
          <Form.Control
            type="text"
            value={howMuch}
            onChange={handleInputChange(setHowMuch)}
            className="input mb-3"
            placeholder="How Much"
          />
        </div>

        <div className="section">
          <Form.Control
            type="text"
            value={whichChain}
            onChange={handleInputChange(setWhichChain)}
            className="input mb-3"
            placeholder="Which Chain"
          />
          <Form.Control
            type="text"
            value={whichAddress}
            onChange={handleInputChange(setWhichAddress)}
            className="input mb-3"
            placeholder="Which Address"
          />
        </div>

        {/* <Button variant="secondary" onClick={handleUpload} className="mt-3">
          Upload
        </Button> */}
      </Form>
      <SecretProposal />
      {cid && (
        <div className="cid-container">
          <h3>File uploaded successfully!</h3>
          <p>
            CID:{" "}
            <a
              href={`https://files.lighthouse.storage/viewFile/${cid}`}
              target="_blank"
              rel="noopener noreferrer">
              {cid}
            </a>
          </p>
        </div>
      )}
      <br />
      <span className="footer">
        Documentation:{" "}
        <a
          href="https://docs.inco.network/introduction/inco-network-introduction"
          target="_blank"
          rel="noopener noreferrer">
          docs.inco.network
        </a>
      </span>
    </div>
  );
}

export default CreateProposal;
