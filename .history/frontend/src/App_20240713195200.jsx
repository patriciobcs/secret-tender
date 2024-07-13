import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { init } from "./utils/fhevm";
import { Connect } from "./Connect";
import SubmitTender from "./SubmitTender";
import SubmitProject from "./SubmitProject";
import Example from "./Example";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  return (
    <div className="App">
      <div className="menu">
        <Connect>
          {(account, provider) => {
            if (!isConnected) {
              setIsConnected(true);
            }
            return null;
          }}
        </Connect>
        {isConnected && (
          <>
            <h1>
              Welcome to <span>Secret Tender</span>
            </h1>
            <h2>What is your next step?</h2>
            <Link to="/submit-tender">
              <Button variant="primary">Submit Tender</Button>
            </Link>
            <Link to="/submit-project">
              <Button variant="secondary">Submit Project</Button>
            </Link>
            <Link to="/example">
              <Button variant="info">Show Example</Button>
            </Link>
          </>
        )}
      </div>

      <Switch>
        <Route path="/submit-tender" component={SubmitTender} />
        <Route path="/submit-project" component={SubmitProject} />
        <Route path="/example" component={Example} />
        {/* Add other routes here as needed */}
      </Switch>
    </div>
  );
}

export default App;
