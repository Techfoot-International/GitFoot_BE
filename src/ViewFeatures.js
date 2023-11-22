import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ViewFeatures() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch features from the server
    axios
      .get("http://localhost:3000/features") // Update the URL to your server
      .then((response) => {
        setFeatures(response.data);
      })
      .catch((error) => {
        console.error("Error fetching features:", error);
        if (error.response) {
          console.error("Response Data:", error.response.data);
          console.error("Status Code:", error.response.status);
        }
      });
      
  }, []);

  return (
    <div>
      <h2>View Features</h2>
      <Link to="/add-feature" className="new-button">
        NEW
      </Link>

      <table className="feature-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={feature.id}>
              <td>{index + 1}</td>
              <td>{feature.name}</td>
              <td>{feature.description}</td>
              <td>
                <Link to={`/feature-details/${feature.id}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewFeatures;
