import "./App.css";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { init } from "./utils/fhevm";
import { Connect } from "./Connect";
import Example from "./Example";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showExample, setShowExample] = useState(false);

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
            <h2>what is your next step?</h2>
            <Button variant="primary" onClick={() => setShowExample(true)}>
              Submit Tender
            </Button>
            <Button variant="secondary" onClick={() => setShowExample(true)}>
              Submit project
            </Button>
            {showExample && <Example />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
