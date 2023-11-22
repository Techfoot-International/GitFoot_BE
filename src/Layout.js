import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Layout.css";
// import ViewUsecases from "./ViewUsecases"; // Import the ViewUsecases component

function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <i className="fa fa-bars menu-icon" onClick={toggleSidebar}></i>
          <span className="logo">GitFoot</span>
        </div>
        <div className="header-right">
          <i className="fa fa-bell notification-icon"></i>
          <i className="fa fa-question-circle help-icon"></i>
          <i className="fa fa-user login-icon"></i>
        </div>
      </header>
      <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/view-domain-objects">Objects</Link>
          </li>
          <li>
            <Link to="/new-table-details">Tables</Link>
          </li>
          <li>
            <Link to="/view-usecases">Use Cases</Link>
          </li>
          {/* <li>
            <Link to="/view-features">Features</Link>
          </li> */}
          <li>
            <Link to="/view-modules">Modules</Link>
          </li>
          <li>
            <Link to="/view-products">Products</Link>
          </li>
          
        </ul>
      </nav>
      <main className="content">{children}</main>
      <footer className="footer"></footer>
    </div>
  );
}

export default Layout;
