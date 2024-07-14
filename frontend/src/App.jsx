import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { init } from "./utils/fhevm";
import { Connect } from "./Connect";
import CreateProposal from "./CreateProposal";
import SubmitTender from "./SubmitTender";
import Dashboard from "./Dashboard";

import "./App.css";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  return (
    <Router>
      <div className="App">
        <Connect>
          {(connectedAccount, provider) => {
            if (!isConnected) {
              setIsConnected(true);
              setAccount(connectedAccount);
            }
            return null;
          }}
        </Connect>

        <div className="content">
          <h1>
            Welcome to <span>Secret Tender</span>
          </h1>
          <p>
            Switch to Inco Gentry Testnet on Metamask:{" "}
            <a href="https://guide.url" className="guide-link">
              Guide
            </a>
          </p>
          {isConnected && (
            <div className="menu">
              <h2>What is your next step?</h2>
              <div className="button-group">
                <Link to="/create-proposal">
                  <button type="button" className="btn btn-secondary">
                    Create Proposal
                  </button>
                </Link>
                <Link to="/submit-tender">
                  <button type="button" className="btn btn-secondary">
                    Submit Tender
                  </button>
                </Link>
                <Link to="/dashboard">
                  <button type="button" className="btn btn-secondary">
                    Dashboard
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
        <Routes>
          <Route path="/create-proposal" element={<CreateProposal />} />
          <Route path="/submit-tender" element={<SubmitTender />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
