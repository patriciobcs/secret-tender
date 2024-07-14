import React from "react";
import { Button } from "react-bootstrap";
import "./TenderView.css"; // Ensure you have this CSS file

function TenderView() {
  return (
    <div className="tender-view-container">
      <div className="proposal-list">
        <div className="proposal-item">
          <h2>Goal:</h2>
          <p>Description:</p>
          <a href="#link" className="view-submission">
            View Submission
          </a>
        </div>
        <div className="proposal-item">
          <h2>Goal:</h2>
          <p>Description:</p>
          <a href="#link" className="view-submission">
            View Submission
          </a>
        </div>
        <div className="proposal-item">
          <h2>Goal:</h2>
          <p>Description:</p>
          <a href="#link" className="view-submission">
            View Submission
          </a>
        </div>
        <div className="proposal-item">
          <h2>Goal:</h2>
          <p>Description:</p>
          <a href="#link" className="view-submission">
            View Submission
          </a>
        </div>
      </div>
    </div>
  );
}

export default TenderView;
