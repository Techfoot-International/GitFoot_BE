import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./DomainObjectDetails.css";

function DomainObjectDetails() {
  const { name } = useParams();
  const [domainObject, setDomainObject] = useState(null);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedTables, setSelectedTables] = useState([]);
  const [linkedTables, setLinkedTables] = useState([]);
  const [isDetailsSent, setIsDetailsSent] = useState(false);
  const [tablesFromDatabase, setTablesFromDatabase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (name) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/domainobject/${name}`
        );
        setDomainObject(response.data);

        const linkedTablesResponse = await axios.get(
          `http://localhost:3000/domainobject/${response.data.id}/linkedtables`
        );
        setLinkedTables(linkedTablesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching domain object details:", error);
        setError("Failed to fetch domain object details");
        setLoading(false);
      }
    };

    fetchData(name);

    axios
      .get("http://localhost:3000/newtable")
      .then((response) => {
        setTablesFromDatabase(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tables from the database:", error);
        setError("Failed to fetch tables from the database");
      });
  }, [name]);

  const handleTableSelect = () => {
    if (selectedTable && !selectedTables.includes(selectedTable)) {
      setSelectedTables([...selectedTables, selectedTable]);
      setSelectedTable("");
    }
  };

  const handleRemoveTable = (tableId) => {
    const updatedSelectedTables = selectedTables.filter(
      (table) => table !== tableId
    );
    setSelectedTables(updatedSelectedTables);
  };

  const handleSendDetails = () => {
    // Implement the logic for sending updated details to the server.
    // You can use the domainObject state to get the updated data.
    // Make an Axios POST request to send the data to the server.
    axios
      .put(`http://localhost:3000/domainobject/${domainObject.id}`, domainObject)
      .then(() => {
        setIsDetailsSent(true);
      })
      .catch((error) => {
        console.error("Error updating domain object:", error);
        alert("Failed to update domain object. Please try again.");
      });
  };

  const handlePropertyChange = (index, field, value) => {
    const updatedProperties = [...domainObject.Properties];
    updatedProperties[index][field] = value;
    const updatedDomainObject = { ...domainObject, Properties: updatedProperties };
    setDomainObject(updatedDomainObject);
  };

  const handleMethodChange = (index, field, value) => {
    const updatedMethods = [...domainObject.Methods];
    updatedMethods[index][field] = value;
    const updatedDomainObject = { ...domainObject, Methods: updatedMethods };
    setDomainObject(updatedDomainObject);
  };

  const handleMethodInputChange = (methodIndex, inputIndex, field, value) => {
    const updatedMethods = [...domainObject.Methods];
    updatedMethods[methodIndex].Inputs[inputIndex][field] = value;
    const updatedDomainObject = { ...domainObject, Methods: updatedMethods };
    setDomainObject(updatedDomainObject);
  };

  const handleMethodOutputChange = (methodIndex, outputIndex, field, value) => {
    const updatedMethods = [...domainObject.Methods];
    updatedMethods[methodIndex].Outputs[outputIndex][field] = value;
    const updatedDomainObject = { ...domainObject, Methods: updatedMethods };
    setDomainObject(updatedDomainObject);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const availableTables = tablesFromDatabase.filter(
    (table) => !selectedTables.includes(table.id)
  );

  return (
    <div className="domain-details-container">
      <h2>Domain Object Details</h2>
      <h3>Name: {domainObject.name}</h3>

      <h3 className="section-heading">Properties:</h3>
      <table className="details-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {domainObject.Properties && domainObject.Properties.length > 0 ? (
            domainObject.Properties.map((property, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={property.name}
                    onChange={(e) => handlePropertyChange(index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={property.type}
                    onChange={(e) => handlePropertyChange(index, 'type', e.target.value)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No properties found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 className="section-heading">Methods:</h3>
      <table className="details-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Inputs</th>
            <th>Outputs</th>
          </tr>
        </thead>
        <tbody>
          {domainObject.Methods && domainObject.Methods.length > 0 ? (
            domainObject.Methods.map((method, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={method.name}
                    onChange={(e) => handleMethodChange(index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <ul>
                    {method.Inputs && method.Inputs.length > 0 ? (
                      method.Inputs.map((input, inputIndex) => (
                        <li key={inputIndex}>
                          Name:
                          <input
                            type="text"
                            value={input.name}
                            onChange={(e) => handleMethodInputChange(index, inputIndex, 'name', e.target.value)}
                          />
                          Type:
                          <input
                            type="text"
                            value={input.type}
                            onChange={(e) => handleMethodInputChange(index, inputIndex, 'type', e.target.value)}
                          />
                        </li>
                      ))
                    ) : (
                      <li>No Inputs found.</li>
                    )}
                  </ul>
                </td>
                <td>
                  <ul>
                    {method.Outputs && method.Outputs.length > 0 ? (
                      method.Outputs.map((output, outputIndex) => (
                        <li key={outputIndex}>
                          Name:
                          <input
                            type="text"
                            value={output.name}
                            onChange={(e) => handleMethodOutputChange(index, outputIndex, 'name', e.target.value)}
                          />
                          Type:
                          <input
                            type="text"
                            value={output.type}
                            onChange={(e) => handleMethodOutputChange(index, outputIndex, 'type', e.target.value)}
                          />
                        </li>
                      ))
                    ) : (
                      <li>No Outputs found.</li>
                    )}
                  </ul>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No methods found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 className="section-heading">Linked Tables:</h3>
      <table className="linked-tables">
        <thead>
          <tr>
            <th>#</th>
            <th>Table Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {linkedTables.map((linkedTable, index) => (
            <tr key={linkedTable.id}>
              <td>{index + 1}</td>
              <td>{linkedTable.name}</td>
              <td>
                <Link
                  to={{
                    pathname: `/new-table-details/${linkedTable.name}`,
                    state: { linkedTable },
                  }}
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-dropdown">
        <label>Select a Table:</label>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">Select a table</option>
          {availableTables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.name}
            </option>
          ))}
        </select>
        <button onClick={handleTableSelect}>Assign Table</button>
      </div>

      <h3 className="section-heading">Selected Tables:</h3>
      <ul>
        {selectedTables.map((tableId, index) => (
          <li key={index}>
            {tableId}{" "}
            <button onClick={() => handleRemoveTable(tableId)}>Remove</button>
          </li>
        ))}
      </ul>

      <button onClick={handleSendDetails}>Update</button>

      {isDetailsSent && <p>Details sent successfully!</p>}

      <Link to="/view-domain-objects" className="go-back-button">
        Go Back
      </Link>
    </div>
  );
}

export default DomainObjectDetails;
