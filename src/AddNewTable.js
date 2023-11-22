import React, { useState } from "react";
import axios from "axios";
import "./AddNewTable.css";

function AddNewTable() {
  const [newTable, setNewTable] = useState({
    name: "",
    type: "",
    properties: [], // Array to store properties
  });

  const [property, setProperty] = useState({
    name: "",
    type: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTable({
      ...newTable,
      [name]: value,
    });
  };

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    setProperty({
      ...property,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!newTable.name) {
      errors.name = "Name is required";
    }

    return errors;
  };

  const handleAddProperty = () => {
    // Validate property input here if needed
    const newProperty = { ...property };

    // Add the new property to the properties array
    setNewTable({
      ...newTable,
      properties: [...newTable.properties, newProperty],
    });

    // Clear the property input fields
    setProperty({ name: "", type: "" });
  };

  const handleAddTable = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post("http://localhost:3000/newtable", newTable)
        .then((response) => {
          console.log("Table added successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error adding table:", error);
        });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      <h2>Add New Table</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newTable.name}
          onChange={handleInputChange}
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>
      <div>
        <h2>Add Properties for New Table</h2>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={property.name}
          onChange={handlePropertyChange}
        />
        <label>Type:</label>
        <input
          type="text"
          name="type"
          value={property.type}
          onChange={handlePropertyChange}
        />
        <br />
        <button onClick={handleAddProperty}>Add Property</button>
      </div>
      <div>
        <h3>Table Properties:</h3>
        <ul>
          {newTable.properties.map((property, index) => (
            <li key={index}>
              Name: {property.name}, Type: {property.type}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleAddTable}>Add Table</button>
      </div>
    </div>
  );
}

export default AddNewTable;
