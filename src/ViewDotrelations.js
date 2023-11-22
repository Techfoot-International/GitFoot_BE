import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ViewDotrelations() {
  const [dotrelations, setDotrelations] = useState([]);
  const [domainObjects, setDomainObjects] = useState([]);
  const [tableNames, setTableNames] = useState({});

  useEffect(() => {
    // Fetch Dotrelation data from the server
    axios.get("http://localhost:3000/dotrelation").then((response) => {
      setDotrelations(response.data);
    });

    // Fetch Domain Object data
    axios.get("http://localhost:3000/domainobject").then((response) => {
      setDomainObjects(response.data);
    });

    // Fetch table names and store them in the 'tableNames' state
    axios.get("http://localhost:3000/newtable").then((response) => {
      const names = {};
      response.data.forEach((table) => {
        names[table.id] = table.name;
      });
      setTableNames(names);
    });
  }, []); // Empty dependency array, to run this effect only once

  return (
    <div>
      
      <h2>Assigned Tables</h2>
      <table>
        <thead>
          <tr>
            <th>Domain Object ID</th>
            <th>Domain Object Name</th>
            <th>Linked Tables</th>
          </tr>
        </thead>
        <tbody>
          {domainObjects.map((domainObject) => (
            <tr key={domainObject.id}>
              <td>{domainObject.id}</td>
              <td>{domainObject.name}</td>
              <td>
                {dotrelations
                  .filter((dotrelation) => dotrelation.domainobject_id === domainObject.id)
                  .map((dotrelation) => (
                    <div key={dotrelation.id}>
                      {dotrelation.newtable_id} - {tableNames[dotrelation.newtable_id]}
                    </div>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/" className="go-back-button"> Go Back </Link>
    </div>
  );
}

export default ViewDotrelations;
