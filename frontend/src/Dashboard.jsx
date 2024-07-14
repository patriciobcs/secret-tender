import React from "react";
import { Button } from "react-bootstrap";
import "./SecretInput.css";

function Dashboard() {
  return (
    <div className="secret-tender-container">
      <header className="header">
        <p className="subtitle">Unlocking onchain Sealed Proposals</p>
      </header>

      <div className="section create-proposal-container">
        <Button className="create-proposal-button">
          ++ Create a Proposal ++
        </Button>
      </div>

      <div className="section proposal-list">
        <div className="proposal-item">Prop 1</div>
        <div className="proposal-item">Prop 2</div>
        <div className="proposal-item">Prop 3</div>
        <div className="proposal-item">Prop 4</div>
      </div>
    </div>
  );
}

export default Dashboard;
