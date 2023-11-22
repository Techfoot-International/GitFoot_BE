import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/add-domain-object">Add Domain Object</Link>
        </li>
        <li>
          <Link to="/view-domain-objects">View Domain Objects</Link>
        </li>
        <li>
          <Link to="/check-details">Check Details</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
