import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="homepage">
      <h1>Impact Analysis</h1>
      {/* <h2>Domain Object Panel</h2> */}
      <Link to="/add-domain-object" className="custom-button new-button">
        New
      </Link>
      <Link to="/view-domain-objects" className="custom-button view-button">
        View
      </Link>
      <Link to="/add-new-table" className="custom-button details-button">
        Add New Table
      </Link>
      <Link to="/view-dotrelations" className="custom-button view-button">
        View Table Relations
      </Link>
    </div>
  );
}

export default HomePage;
