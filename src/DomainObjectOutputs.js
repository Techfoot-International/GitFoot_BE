import React from 'react';

function DomainObjectOutputs({ newDomainObject, handleInputChange }) {
  return (
    <>
      <h2>Add Outputs</h2>
      <div>
        <label>Outputs:</label>
        <input
          type="text"
          name="outputs"
          value={newDomainObject.outputs}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
}

export default DomainObjectOutputs;
