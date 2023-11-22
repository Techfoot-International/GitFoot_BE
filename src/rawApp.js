import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./App.css";
import "./styles.css";
import Navbar from "./Navbar";
import AddDomainObject from "./AddDomainObject";
import ViewDomainObjects from "./ViewDomainObjects";
import CheckDetails from "./CheckDetails";
import HomePage from "./HomePage";

function App() {
  const [, setDomainObjects] = useState([]);
  const [newDomainObject, setNewDomainObject] = useState({
    name: "",
    properties: [],
    methods: [],
  });

  const [methodCounter, setMethodCounter] = useState(1);

  // Function to fetch domain objects from the backend
  const fetchDomainObjects = () => {
    axios
      .get("http://localhost:3000/domainobject") // Update the URL to match your backend API endpoint
      .then((response) => {
        setDomainObjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching domain objects:", error);
      });
  };

  useEffect(() => {
    fetchDomainObjects(); // Fetch domain objects when the component mounts
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

  const handleAddDomainObject = () => {
    axios
      .post("http://localhost:3000/domainobject", newDomainObject) // Update the URL to match your backend API endpoint
      .then((response) => {
        console.log("Data saved successfully:", response.data);
        fetchDomainObjects(); // Fetch updated domain objects after adding a new one
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  // ... Rest of your methods ...

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />{" "}
          <Route path="/add-domain-object" element={<AddDomainObject />} />
          <Route path="/check-details/:id" element={<CheckDetails />} />
          <Route path="/view-domain-objects" element={<ViewDomainObjects />} />
        </Routes>
        <div className="domain">
          <h2>Add Domain Object</h2>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newDomainObject.name}
              onChange={(e) =>
                setNewDomainObject({ ...newDomainObject, name: e.target.value })
              }
            />
          </div>
          <div className="properties">
            <h2>Add Properties</h2>
            {newDomainObject.properties.map((property, propertyIndex) => (
              <div key={propertyIndex}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={property.name}
                  onChange={(e) => handlePropertyChange(e, propertyIndex)}
                />
                <label>Type:</label>
                <input
                  type="text"
                  name="type"
                  value={property.type}
                  onChange={(e) => handlePropertyChange(e, propertyIndex)}
                />
                {propertyIndex > 0 && (
                  <button onClick={() => handleRemoveProperty(propertyIndex)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button onClick={handleAddProperty}>Add Property</button>
          </div>
          <div className="methods">
            <h2>Add Methods</h2>
            {newDomainObject.methods.map((method, methodIndex) => (
              <div key={methodIndex}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={method.name}
                  onChange={(e) => handleMethodChange(e, methodIndex)}
                />
                <h3>Inputs</h3>
                {method.inputs.map((input, inputIndex) => (
                  <div key={inputIndex}>
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={input.name}
                      onChange={(e) =>
                        handleInputChange(e, methodIndex, "inputs", inputIndex)
                      }
                    />
                    <label>Type:</label>
                    <input
                      type="text"
                      name="type"
                      value={input.type}
                      onChange={(e) =>
                        handleInputChange(e, methodIndex, "inputs", inputIndex)
                      }
                    />
                    {inputIndex > 0 && (
                      <button
                        onClick={() =>
                          handleRemoveInputOutput(
                            methodIndex,
                            "inputs",
                            inputIndex
                          )
                        }
                      >
                        Remove Input
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleAddInputOutput(methodIndex, "inputs")}
                >
                  Add Input
                </button>
                <h3>Outputs</h3>
                {method.outputs.map((output, outputIndex) => (
                  <div key={outputIndex}>
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={output.name}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          methodIndex,
                          "outputs",
                          outputIndex
                        )
                      }
                    />
                    <label>Type:</label>
                    <input
                      type="text"
                      name="type"
                      value={output.type}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          methodIndex,
                          "outputs",
                          outputIndex
                        )
                      }
                    />
                    {outputIndex > 0 && (
                      <button
                        onClick={() =>
                          handleRemoveInputOutput(
                            methodIndex,
                            "outputs",
                            outputIndex
                          )
                        }
                      >
                        Remove Output
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleAddInputOutput(methodIndex, "outputs")}
                >
                  Add Output
                </button>
                {methodIndex > 0 && (
                  <button onClick={() => handleRemoveMethod(methodIndex)}>
                    Remove Method
                  </button>
                )}
              </div>
            ))}
            <button onClick={handleAddMethod}>Add Method</button>
          </div>
          <br />
          <button onClick={handleAddDomainObject}>Add Domain Object</button>
        </div>
      </div>
    </Router>
  );
}

export default App;
