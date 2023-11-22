import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddDomainObject.css";

function AddDomainObject() {
  const [newDomainObject, setNewDomainObject] = useState({
    name: "",
    properties: [],
    methods: [],
    selectedTable: "",
  });

  const [methodCounter, setMethodCounter] = useState(1);
  const [tableNames, setTableNames] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]); // Store selected tables

  useEffect(() => {
    axios
      .get("http://localhost:3000/newtable")
      .then((response) => {
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
    if (
      newDomainObject.selectedTable &&
      !selectedTables.includes(newDomainObject.selectedTable)
    ) {
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
    if (!newDomainObject.name.trim()) {
      alert("Domain object name is required.");
      return;
    }

    if (
      newDomainObject.methods.length < 1 ||
      newDomainObject.properties.length < 1
    ) {
      alert("You must add at least one method and one property.");
      return;
    }

    if (selectedTables.length === 0) {
      alert("Please select at least one table to link.");
      return;
    }

    // Include the selectedTables data in the newDomainObject
    const domainObjectWithTables = {
      ...newDomainObject,
      linkedTables: selectedTables,
    };

    axios
      .post("http://localhost:3000/domainobject", domainObjectWithTables)
      .then((response) => {
        console.log("Data saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <div className="add-domain-object">
      <h2>Add Domain Object</h2>
      <div className="form-section">
        <label className="form-label">Name:</label>
        <input
          type="text"
          name="name"
          value={newDomainObject.name}
          onChange={(e) =>
            setNewDomainObject({ ...newDomainObject, name: e.target.value })
          }
        />
      </div>

      <div className="form-section">
        <select
          name="selectedTable"
          value={newDomainObject.selectedTable}
          onChange={handleTableSelect}
        >
          <option value="">Select a table to link</option>
          {tableNames.map((tableName, index) => (
            <option key={index} value={tableName}>
              {tableName}
            </option>
          ))}
        </select>
        <button onClick={handleAddTable} className="add-button">
          Link Table
        </button>
      </div>

      <div className="linked-tables">
        <h3>Linked Tables:</h3>
        {selectedTables.map((tableName, index) => (
          <div key={index} className="linked-table">
            {tableName}
            <button
              onClick={() => handleRemoveTable(tableName)}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="form-section">
        {newDomainObject.properties.map((property, propertyIndex) => (
          <div key={propertyIndex} className="property">
            <div className="form-section">
              <label className="form-label">Name:</label>
              <input
                type="text"
                name="name"
                value={property.name}
                onChange={(e) => handlePropertyChange(e, propertyIndex)}
              />
            </div>
            <div className="form-section">
              <label className="form-label">Type:</label>
              <input
                type="text"
                name="type"
                value={property.type}
                onChange={(e) => handlePropertyChange(e, propertyIndex)}
              />
            </div>
            {propertyIndex > 0 && (
              <button
                onClick={() => handleRemoveProperty(propertyIndex)}
                className="remove-button"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button onClick={handleAddProperty} className="add-button">
          Add Property
        </button>
      </div>

      <div className="form-section">
        {newDomainObject.methods.map((method, methodIndex) => (
          <div key={methodIndex} className="method">
            <div className="form-section">
              <label className="form-label">Name:</label>
              <input
                type="text"
                name="name"
                value={method.name}
                onChange={(e) => handleMethodChange(e, methodIndex)}
              />
            </div>
            {method.inputs.map((input, inputIndex) => (
              <div key={inputIndex} className="input">
                <div className="form-section">
                  <label className="form-label">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={(e) =>
                      handleInputChange(e, methodIndex, "inputs", inputIndex)
                    }
                  />
                </div>
                <div className="form-section">
                  <label className="form-label">Type:</label>
                  <input
                    type="text"
                    name="type"
                    value={input.type}
                    onChange={(e) =>
                      handleInputChange(e, methodIndex, "inputs", inputIndex)
                    }
                  />
                </div>
                {inputIndex > 0 && (
                  <button
                    onClick={() =>
                      handleRemoveInputOutput(methodIndex, "inputs", inputIndex)
                    }
                    className="remove-button"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => handleAddInputOutput(methodIndex, "inputs")}
              className="add-button"
            >
              Add Input
            </button>
            {method.outputs.map((output, outputIndex) => (
              <div key={outputIndex} className="output">
                <div className="form-section">
                  <label className="form-label">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={output.name}
                    onChange={(e) =>
                      handleInputChange(e, methodIndex, "outputs", outputIndex)
                    }
                  />
                </div>
                <div className="form-section">
                  <label className="form-label">Type:</label>
                  <input
                    type="text"
                    name="type"
                    value={output.type}
                    onChange={(e) =>
                      handleInputChange(e, methodIndex, "outputs", outputIndex)
                    }
                  />
                </div>
                {outputIndex > 0 && (
                  <button
                    onClick={() =>
                      handleRemoveInputOutput(
                        methodIndex,
                        "outputs",
                        outputIndex
                      )
                    }
                    className="remove-button"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => handleAddInputOutput(methodIndex, "outputs")}
              className="add-button"
            >
              Add Output
            </button>
            {methodIndex > 0 && (
              <button
                onClick={() => handleRemoveMethod(methodIndex)}
                className="remove-button"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button onClick={handleAddMethod} className="add-button">
          Add Method
        </button>
      </div>

      <button onClick={handleAddDomainObject} className="submit-button">
        Add Domain Object
      </button>
    </div>
  );
}

export default AddDomainObject;
