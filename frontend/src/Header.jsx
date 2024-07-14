import React from "react";
import "./Header.css";

function Header({ account }) {
  return (
    <header className="header">
      <div className="container">
        {account && (
          <div className="account-info">
            {/* <span>Connected with {account}</span> */}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
