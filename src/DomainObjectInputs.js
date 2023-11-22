import React from 'react';

function DomainObjectInputs({ newDomainObject, handleInputChange }) {
  return (
    <>
      <h2>Add Input</h2>
      <div>
        <label>Inputs:</label>
        <input
          type="text"
          name="inputs"
          value={newDomainObject.inputs}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
}

export default DomainObjectInputs;
