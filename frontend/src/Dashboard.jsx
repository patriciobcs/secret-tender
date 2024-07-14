import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./CreateProposal.css"; // Ensure you have this CSS file

function Dashboard() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const savedSubmissions =
      JSON.parse(localStorage.getItem("submissions")) || [];
    setSubmissions(savedSubmissions.reverse()); // Reverse the order to show the most recent first
  }, []);

  return (
    <div className="dashboard-container">
      <div className="proposal-list">
        {submissions.map((submission, index) => (
          <div className="proposal-item" key={index}>
            <h2>Goal: {submission.goal}</h2>
            <p>Description: {submission.description}</p>
            <a
              href={`https://files.lighthouse.storage/viewFile/${submission.cid}`}
              className="view-submission"
              target="_blank"
              rel="noopener noreferrer">
              View Submission
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
