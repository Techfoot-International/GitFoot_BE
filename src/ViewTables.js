// ViewTables.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import "./ViewTables.css";

function ViewTables() {
  const [newTables, setNewTables] = useState([]);

  const fetchNewTables = () => {
    axios
      .get("http://localhost:3000/newtable") // Update the URL with your server's endpoint
      .then((response) => {
        setNewTables(response.data);
      })
      .catch((error) => {
        console.error("Error fetching new tables:", error);
      });
  };

  useEffect(() => {
    fetchNewTables();
  }, []);

  return (
    <div>
      <h2>View Tables</h2>

      <Link to="/add-new-table" className="new-button">
        NEW
      </Link>

      <table className="add-new-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newTables.map((newTable, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{newTable.name}</td>
              <td>
                <Link to={`/new-table-details/${newTable.name}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {/* <Link to="/" className="go-back-button">
        Go Back
      </Link> */}
    </div>
  );
}

export default ViewTables;
