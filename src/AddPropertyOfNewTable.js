import React, { useState } from "react";
import axios from "axios";

function AddPropertyOfNewTable({ newTableId }) {
  const [property, setProperty] = useState({
    name: "",
    type: "",
  });

  const [errors, setErrors] = useState({}); // State for validation errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty({
      ...property,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!property.name) {
      errors.name = "Name is required";
    }

    if (!property.type) {
      errors.type = "Type is required";
    }

    return errors;
  };

  const handleAddProperty = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // No validation errors, proceed with the POST request
      axios
        .post(`http://localhost:3000/newtable/${newTableId}/property`, property)
        .then((response) => {
          console.log("Property added successfully:", response.data);
          // You can add a redirect or other actions after adding the property
        })
        .catch((error) => {
          console.error("Error adding property:", error);
        });
    } else {
      // Validation errors found, update the state to display them
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      <h2>Add Property of NewTable</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={property.name}
          onChange={handleInputChange}
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>
      <div>
        <label>Type:</label>
        <input
          type="text"
          name="type"
          value={property.type}
          onChange={handleInputChange}
        />
        {errors.type && <div className="error">{errors.type}</div>}
      </div>
      <br />
      <button onClick={handleAddProperty}>Add Property</button>
    </div>
  );
}

export default AddPropertyOfNewTable;
