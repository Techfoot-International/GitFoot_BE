import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function ViewModules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch modules from the server
    axios
      .get("http://localhost:3000/modules") // Update the URL to your server
      .then((response) => {
        setModules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching modules:", error);
      });
  }, []);

  return (
    <div>
      <h2>View Modules</h2>
      <Link to="/add-module" className="new-button">
        NEW
      </Link>

      <table className="use-case-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((usecase, index) => (
            <tr key={usecase.id}>
              <td>{index + 1}</td>
              <td>{usecase.name}</td>
              <td>{usecase.description}</td>
              <td>
              <Link to={`/module-details/${usecase.id}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewModules;
