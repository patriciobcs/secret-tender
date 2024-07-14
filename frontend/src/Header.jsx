import React from "react";
import "./Header.css";

function Header({ account }) {
  return (
    <header className="header">
      <div className="container">
        <div className="title-container">
          <h1>Secret Tender</h1>
          <p>Unlocking onchain Sealed Proposals</p>
        </div>
        {account && (
          <div className="account-info">
            <span>Connected with {account}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
