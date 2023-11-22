import React from 'react';

function DomainObjectMethods({ newDomainObject, handleInputChange }) {
  return (
    <>
      <h2>Add Methods</h2>
      <div>
        <label>Methods:</label>
        <input
          type="text"
          name="methods"
          value={newDomainObject.methods}
          onChange={handleInputChange}
        />
        {/* <br></br>
        <label>Name:</label>
        <input
          type="text"
          name="methods"
          value={newDomainObject.methods}
          onChange={handleInputChange}
        />
        <label>Type:</label>
        <input
          type="text"
          name="methods"
          value={newDomainObject.methods}
          onChange={handleInputChange}
        /> */}
      </div>
    </>
  );
}

export default DomainObjectMethods;
