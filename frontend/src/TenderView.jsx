import React from "react";
import { Button } from "react-bootstrap";
import "./SecretInput.css"; // Ensure you have this CSS file

function TenderView() {
  return (
    <div className="tender-view-container">
      <header className="header">
        <h1 className="title">Secret Tender</h1>
        <p className="subtitle">Unlocking onchain Sealed Proposals</p>
        <Button className="connect-button">Connect</Button>
      </header>

      <div className="create-proposal-container">
        <Button className="create-proposal-button">
          ++ Create a Proposal ++
        </Button>
      </div>

      <div className="proposal-list">
        <div className="proposal-item">Prop 1</div>
        <div className="proposal-item">Prop 2</div>
        <div className="proposal-item">Prop 3</div>
        <div className="proposal-item">Prop 4</div>
      </div>
    </div>
  );
}

export default TenderView;
