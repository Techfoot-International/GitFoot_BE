import React from 'react';

const MethodsInput = ({ value, handleInputChange }) => {
  return (
    <div>
      <label>Name:</label>
      <input
        type="text"
        name="methods"
        value={value}
        onChange={handleInputChange}
      />
      <label>Type:</label>
      <input
        type="text"
        name="methodsType" // Use a unique name for type input
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default MethodsInput;
