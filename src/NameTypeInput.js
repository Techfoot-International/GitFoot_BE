import React from 'react';

const NameTypeInput = ({ label, nameValue, typeValue, onNameChange, onTypeChange }) => {
  return (
    <div>
      <label>{label} Name:</label>
      <input type="text" name={nameValue} value={nameValue} onChange={onNameChange} />
      <label>{label} Type:</label>
      <input type="text" name={typeValue} value={typeValue} onChange={onTypeChange} />
    </div>
  );
};

export default NameTypeInput;
