import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import lighthouse from "@lighthouse-web3/sdk";
import "./CreateProposal.css"; // Reusing the CSS file from CreateProposal

function SubmitTender() {
  const [cid, setCid] = useState("");
  const [tenderDetails, setTenderDetails] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [proposal, setProposal] = useState("");

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    exportJson();
  };

  const exportJson = () => {
    const formData = {
      cid,
      tenderDetails,
      submitterName,
      contactInfo,
      proposal,
    };

    const json = JSON.stringify(formData, null, 2);

    // Create and download JSON file locally
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tenderData.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    const formData = {
      cid,
      tenderDetails,
      submitterName,
      contactInfo,
      proposal,
    };

    const json = JSON.stringify(formData, null, 2);

    // Create a FormData object to handle file uploads in the browser
    const formDataUpload = new FormData();
    const blob = new Blob([json], { type: "application/json" });
    formDataUpload.append("file", blob, "tenderData.json");

    // Upload JSON file to Filecoin using Lighthouse
    try {
      const apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY; // Replace with your actual API key
      console.log(apiKey); // For debugging
      const response = await lighthouse.uploadText(json, apiKey);
      console.log(response);
      setCid(response.data.Hash); // Set the CID state
      alert(`File uploaded successfully! CID: ${response.data.Hash}`);

      // Save submission to localStorage
      const submissions =
        JSON.parse(localStorage.getItem("tenderSubmissions")) || [];
      submissions.push({
        ...formData,
        cid: response.data.Hash,
      });
      localStorage.setItem("tenderSubmissions", JSON.stringify(submissions));
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="secret-tender-container consistent-width">
      <h1>
        Create <span className="highlight">Tender</span>
      </h1>
      <Form className="form-container" onSubmit={handleSubmit}>
        <div className="section">
          <Form.Control
            type="text"
            value={cid}
            onChange={handleInputChange(setCid)}
            className="input mb-3"
            placeholder="Tender CID"
            required
          />
          <Form.Control
            type="text"
            value={tenderDetails}
            onChange={handleInputChange(setTenderDetails)}
            className="input mb-3"
            placeholder="Tender Details"
            required
          />
          <Form.Control
            type="text"
            value={submitterName}
            onChange={handleInputChange(setSubmitterName)}
            className="input mb-3"
            placeholder="Your Name"
            required
          />
          <Form.Control
            type="text"
            value={contactInfo}
            onChange={handleInputChange(setContactInfo)}
            className="input mb-3"
            placeholder="Contact Information"
            required
          />
          <Form.Control
            as="textarea"
            value={proposal}
            onChange={handleInputChange(setProposal)}
            className="input mb-3"
            placeholder="Your Proposal"
            rows={5}
            required
          />
        </div>
        <Button variant="secondary" onClick={handleUpload} className="mt-3">
          Create Tender
        </Button>
      </Form>
      {cid && (
        <div className="glass-effect">
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

export default SubmitTender;
