import React, { useState, useEffect } from "react";
import axios from "axios";

function DomainTableLinking() {
  const [domainObjects, setDomainObjects] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedDomainObjectId, setSelectedDomainObjectId] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);

  useEffect(() => {
    // Fetch domain objects and tables here and populate the state variables
    axios.get("http://localhost:3000/domainobject").then((response) => {
      setDomainObjects(response.data);
    });

    axios.get("http://localhost:3000/newtable").then((response) => {
      setTables(response.data);
    });
  }, []);

  const handleLinkClick = () => {
    if (selectedDomainObjectId && selectedTableId) {
      // Send a POST request to create a Dotrelation entry
      axios
        .post("http://localhost:3000/dotrelation", {
          domainObjectId: selectedDomainObjectId,
          newTableId: selectedTableId,
        })
        .then((response) => {
          console.log("Dotrelation created:", response.data);
          // You can perform further actions after successfully linking the domain object and table
        })
        .catch((error) => {
          console.error("Error creating Dotrelation:", error);
        });
    }
  };

  return (
    <div>
      <h2>Link Domain Object and Table</h2>
      <div>
        <label>Select Domain Object:</label>
        <select onChange={(e) => setSelectedDomainObjectId(e.target.value)}>
          <option value="">Select Domain Object</option>
          {domainObjects.map((domainObject) => (
            <option key={domainObject.id} value={domainObject.id}>
              {domainObject.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Table:</label>
        <select onChange={(e) => setSelectedTableId(e.target.value)}>
          <option value="">Select Table</option>
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleLinkClick}>Link Domain Object and Table</button>
    </div>
  );
}

export default DomainTableLinking;
