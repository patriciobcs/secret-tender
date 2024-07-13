import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SubmitTender from "./SubmitTender";
import SubmitProject from "./SubmitProject";

function Home() {
  return (
    <div className="mt-5 flex flex-col items-center">
      <h1 className="my-10 text-2xl font-bold text-gray-500">
        Secret Tendering Platform
      </h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        <Link to="/submit-tender">Submit a Tender</Link>
      </button>
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
        <Link to="/submit-project">Submit a Project</Link>
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit-tender" element={<SubmitTender />} />
        <Route path="/submit-project" element={<SubmitProject />} />
      </Routes>
    </Router>
  );
}

export default App;
