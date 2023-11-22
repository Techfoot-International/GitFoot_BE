import React from 'react';

function DomainObjectProperties({ newDomainObject, handleInputChange }) {
  return (
    <>
      <h2>Add Properties</h2>
      <div>
        <label>Properties:</label>
        <input
          type="text"
          name="properties"
          value={newDomainObject.properties}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
}

export default DomainObjectProperties;
