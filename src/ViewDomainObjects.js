import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ViewDomainObjects.css";

function ViewDomainObjects() {
  const [domainObjects, setDomainObjects] = useState([]);

  const fetchDomainObjects = () => {
    axios
      .get("http://localhost:3000/domainobject")
      .then((response) => {
        setDomainObjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching domain objects:", error);
      });
  };

  useEffect(() => {
    fetchDomainObjects();
  }, []);

  return (
    <div>
      <h2>View Domain Objects</h2>

      <Link to="/add-domain-object" className="new-button">
        NEW
      </Link>

      <table className="domain-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {domainObjects.map((domainObject, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{domainObject.name}</td>
              <td>
                <Link to={`/check-details/${domainObject.name}`}>Details</Link>
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

export default ViewDomainObjects;
