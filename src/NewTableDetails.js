import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function NewTableDetails() {
  const { tableName } = useParams();
  const [tableDetails, setTableDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/newtable/${tableName}`)
      .then((response) => {
        if (response.data) {
          setTableDetails(response.data);
        } else {
          console.error(`Data fetched for table ${tableName} is missing properties:`, response.data);
        }
      })
      .catch((error) => {
        console.error(`Error fetching properties for table ${tableName}:`, error);
      });
  }, [tableName]);

  if (!tableDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Table Details for {tableDetails.name}</h2>
      <h3>Table Properties: </h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        
        <tbody>
          {tableDetails.NewTableProperties && tableDetails.NewTableProperties.length > 0 ? (
            tableDetails.NewTableProperties.map((property, index) => (
              <tr key={index}>
                <td>{property.name}</td>
                <td>{property.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No properties found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Link to="/view-domain-objects" className="go-back-button">
        Go Back
      </Link>
    </div>
  );
}

export default NewTableDetails;
