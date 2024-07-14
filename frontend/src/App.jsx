import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { init } from "./utils/fhevm";
import { Connect } from "./Connect";
import SecretInput from "./SecretInput";
import Dashboard from "./Dashboard";
import Header from "./Header";
import SecretTender from "./SecretTender";
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
        <Header account={account} />
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
                <Link to="/submit-tender">
                  <button type="button" className="btn btn-secondary">
                    Create Proposal
                  </button>
                </Link>
                <Link to="/submit-project">
                  <button type="button" className="btn btn-secondary">
                    Create Tender
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
          {isConnected && <SecretTender />}
        </div>
        <Routes>
          <Route path="/submit-tender" element={<SecretInput />} />
          <Route path="/submit-project" element={<SecretInput />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
