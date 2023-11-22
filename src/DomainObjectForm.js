import React from "react";
import DomainObjectProperties from "./DomainObjectProperties";
import DomainObjectMethods from "./DomainObjectMethods";
import DomainObjectInputs from "./DomainObjectInputs";
import DomainObjectOutputs from "./DomainObjectOutputs";

function DomainObjectForm({
  newDomainObject,
  handleInputChange,
  handleAddDomainObject,
}) {
  return (
    <div>
      <h2>Add Domain Object</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newDomainObject.name}
          onChange={handleInputChange}
        />
      </div>
      {/* Display DomainObjectProperties, DomainObjectMethods, and DomainObjectInputs components */}
      <DomainObjectProperties
        newDomainObject={newDomainObject}
        handleInputChange={handleInputChange}
      />
      <DomainObjectMethods
        newDomainObject={newDomainObject}
        handleInputChange={handleInputChange}
      />
      <DomainObjectInputs
        newDomainObject={newDomainObject}
        handleInputChange={handleInputChange}
      />
      <DomainObjectOutputs
        newDomainObject={newDomainObject}
        handleInputChange={handleInputChange}
      />
      <br />
      <button onClick={handleAddDomainObject}>Add Domain Object</button>
    </div>
  );
}

export default DomainObjectForm;
