import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { init } from "./utils/fhevm";
import { Connect } from "./Connect";
import SubmitTender from "./SubmitTender";
import SubmitProject from "./SubmitProject";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  return (
    <Router>
      <div className="App">
        <div className="menu">
          <Connect>
            {(account, provider) => (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/submit-tender" element={<SubmitTender />} />
                <Route path="/submit-project" element={<SubmitProject />} />
              </Routes>
            )}
          </Connect>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="mt-5 flex flex-col items-center">
      <h1 className="my-10 text-2xl font-bold text-gray-500">
        Secret Tendering Platform
      </h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        <Link
          to="/submit-tender"
          style={{ color: "white", textDecoration: "none" }}>
          Submit a Tender
        </Link>
      </button>
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
        <Link
          to="/submit-project"
          style={{ color: "white", textDecoration: "none" }}>
          Submit a Project
        </Link>
      </button>
    </div>
  );
}

export default App;
