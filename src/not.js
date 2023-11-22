import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AddDomainObject() {
  const [newDomainObject, setNewDomainObject] = useState({
    name: "",
    properties: [],
    methods: [],
    selectedTable: "", // Store the selected table name
  });

  const [methodCounter, setMethodCounter] = useState(1);
  const [tableNames, setTableNames] = useState([]); // Store the list of available table names
  const [selectedTables, setSelectedTables] = useState([]); // Store selected tables

  // Fetch the list of available table names when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3000/newtable") // Replace with your API endpoint for fetching table names
      .then((response) => {
        // Assuming the API returns an array of table objects with a 'name' property
        const tableNamesArray = response.data.map((table) => table.name);
        setTableNames(tableNamesArray);
      })
      .catch((error) => {
        console.error("Error fetching table names:", error);
      });
  }, []);

  const handleInputChange = (e, methodIndex, ioType, ioIndex) => {
    const { name, value } = e.target;
    const updatedMethods = [...newDomainObject.methods];
    updatedMethods[methodIndex][ioType][ioIndex][name] = value;
    setNewDomainObject({
      ...newDomainObject,
      methods: updatedMethods,
    });
  };

  const handlePropertyChange = (e, propertyIndex) => {
    const { name, value } = e.target;
    const updatedProperties = [...newDomainObject.properties];
    updatedProperties[propertyIndex][name] = value;
    setNewDomainObject({
      ...newDomainObject,
      properties: updatedProperties,
    });
  };

  const handleMethodChange = (e, methodIndex) => {
    const { name, value } = e.target;
    const updatedMethods = [...newDomainObject.methods];
    updatedMethods[methodIndex][name] = value;
    setNewDomainObject({
      ...newDomainObject,
      methods: updatedMethods,
    });
  };

  const handleAddProperty = () => {
    setNewDomainObject({
      ...newDomainObject,
      properties: [...newDomainObject.properties, { name: "", type: "" }],
    });
  };

  const handleRemoveProperty = (propertyIndex) => {
    const updatedProperties = [...newDomainObject.properties];
    updatedProperties.splice(propertyIndex, 1);
    setNewDomainObject({
      ...newDomainObject,
      properties: updatedProperties,
    });
  };

  const handleAddMethod = () => {
    const updatedMethods = [...newDomainObject.methods];
    updatedMethods.push({
      name: `Method ${methodCounter}`,
      inputs: [],
      outputs: [],
    });
    setMethodCounter(methodCounter + 1);
    setNewDomainObject({
      ...newDomainObject,
      methods: updatedMethods,
    });
  };

  const handleRemoveMethod = (methodIndex) => {
    const updatedMethods = [...newDomainObject.methods];
    updatedMethods.splice(methodIndex, 1);
    setNewDomainObject({
      ...newDomainObject,
      methods: updatedMethods,
    });
  };

  const handleAddInputOutput = (methodIndex, type) => {
    const updatedMethods = [...newDomainObject.methods];
    updatedMethods[methodIndex][type].push({ name: "", type: "" });
    setNewDomainObject({
      ...newDomainObject,
      methods: updatedMethods,
    });
  };

  const handleRemoveInputOutput = (methodIndex, type, index) => {
    const updatedMethods = [...newDomainObject.methods];
    updatedMethods[methodIndex][type].splice(index, 1);
    setNewDomainObject({
      ...newDomainObject,
      methods: updatedMethods,
    });
  };



  const handleTableSelect = (e) => {
    const { name, value } = e.target;
    setNewDomainObject({
      ...newDomainObject,
      [name]: value,
    });
  };

  const handleAddTable = () => {
    if (newDomainObject.selectedTable && !selectedTables.includes(newDomainObject.selectedTable)) {
      setSelectedTables([...selectedTables, newDomainObject.selectedTable]);
      setNewDomainObject({
        ...newDomainObject,
        selectedTable: "",
      });
    }
  };

  const handleRemoveTable = (tableName) => {
    const updatedTables = selectedTables.filter((table) => table !== tableName);
    setSelectedTables(updatedTables);
  };

  const handleAddDomainObject = () => {
    // Check if the domain object name is not empty
    if (!newDomainObject.name.trim()) {
      alert("Domain object name is required.");
      return;
    }

    // Check if there is at least one method and one property
    if (newDomainObject.methods.length < 1 || newDomainObject.properties.length < 1) {
      alert("You must add at least one method and one property.");
      return;
    }

    // Proceed to add the domain object to the database
    axios
      .post("http://localhost:3000/domainobject", newDomainObject) // Update the URL to match your backend API endpoint
      .then((response) => {
        console.log("Data saved successfully:", response.data);
        // You can add a redirect or other actions after saving
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <div>
      <h2>Add Domain Object</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newDomainObject.name}
          onChange={(e) =>
            setNewDomainObject({ ...newDomainObject, name: e.target.value })
          }
        />
      </div>
      
      <div className="properties">
        <h2>Add Properties</h2>
        {newDomainObject.properties.map((property, propertyIndex) => (
          <div key={propertyIndex}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={property.name}
              onChange={(e) => handlePropertyChange(e, propertyIndex)}
            />
            <label>Type:</label>
            <input
              type="text"
              name="type"
              value={property.type}
              onChange={(e) => handlePropertyChange(e, propertyIndex)}
            />
            {propertyIndex > 0 && (
              <button onClick={() => handleRemoveProperty(propertyIndex)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button onClick={handleAddProperty}>Add Property</button>
      </div>
      <div className="methods">
        <h2>Add Methods</h2>
        {newDomainObject.methods.map((method, methodIndex) => (
          <div key={methodIndex}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={method.name}
              onChange={(e) => handleMethodChange(e, methodIndex)}
            />
            <h3>Inputs</h3>
            {method.inputs.map((input, inputIndex) => (
              <div key={inputIndex}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={(e) =>
                    handleInputChange(e, methodIndex, "inputs", inputIndex)
                  }
                />
                <label>Type:</label>
                <input
                  type="text"
                  name="type"
                  value={input.type}
                  onChange={(e) =>
                    handleInputChange(e, methodIndex, "inputs", inputIndex)
                  }
                />
                {inputIndex > 0 && (
                  <button
                    onClick={() =>
                      handleRemoveInputOutput(methodIndex, "inputs", inputIndex)
                    }
                  >
                    Remove Input
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => handleAddInputOutput(methodIndex, "inputs")}>
              Add Input
            </button>
            <h3>Outputs</h3>
            {method.outputs.map((output, outputIndex) => (
              <div key={outputIndex}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={output.name}
                  onChange={(e) =>
                    handleInputChange(e, methodIndex, "outputs", outputIndex)
                  }
                />
                <label>Type:</label>
                <input
                  type="text"
                  name="type"
                  value={output.type}
                  onChange={(e) =>
                    handleInputChange(e, methodIndex, "outputs", outputIndex)
                  }
                />
                {outputIndex > 0 && (
                  <button
                    onClick={() =>
                      handleRemoveInputOutput(
                        methodIndex,
                        "outputs",
                        outputIndex
                      )
                    }
                  >
                    Remove Output
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => handleAddInputOutput(methodIndex, "outputs")}
            >
              Add Output
            </button>
            {methodIndex > 0 && (
              <button onClick={() => handleRemoveMethod(methodIndex)}>
                Remove Method
              </button>
            )}
          </div>
        ))}
        <button onClick={handleAddMethod}>Add Method</button>
      </div>


      <div className="properties">
        <div>
          <label>Select Table:</label>
          <select
            name="selectedTable"
            value={newDomainObject.selectedTable}
            onChange={handleTableSelect}
          >
            <option value="">Select a table</option>
            {tableNames.map((tableName) => (
              <option key={tableName} value={tableName}>
                {tableName}
              </option>
            ))}
          </select>
          <button onClick={handleAddTable}>Add Table</button>
        </div>
      </div>

      <div className="selected-tables">
        <h2>Selected Tables:</h2>
        <ul>
          {selectedTables.map((tableName) => (
            <li key={tableName}>
              {tableName}{" "}
              <button onClick={() => handleRemoveTable(tableName)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleAddDomainObject}>Add Domain Object</button>
      <Link to="/" className="go-back-button">
        Go Back
      </Link>
    </div>
  );
}

export default AddDomainObject;
