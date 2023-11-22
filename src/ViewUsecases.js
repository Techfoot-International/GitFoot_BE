import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ViewUsecases() {
  const [usecases, setUsecases] = useState([]);

  const fetchUsecases = () => {
    axios
      .get("http://localhost:3000/usecases")
      .then((response) => {
        setUsecases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching use cases:", error);
      });
  };

  useEffect(() => {
    fetchUsecases();
  }, []);

  return (
    <div>
      <h2>View Use Cases</h2>

      <Link to="/add-usecase" className="new-button">
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
          {usecases.map((usecase, index) => (
            <tr key={usecase.id}>
              <td>{index + 1}</td>
              <td>{usecase.name}</td>
              <td>
                {usecase.description ? usecase.description : "No Description"}
              </td>
              <td>
                <Link to={`/use-case-details/${usecase.id}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewUsecases;
