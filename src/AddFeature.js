import React, { useState, useEffect } from "react";
import axios from "axios";

function AddFeature() {
  const [feature, setFeature] = useState({
    name: "",
    description: "",
  });

  const [useCases, setUseCases] = useState([]);
  const [selectedUseCases, setSelectedUseCases] = useState([]);

  useEffect(() => {
    // Load available use cases when the component mounts.
    loadAvailableUseCases();
  }, []);

  const loadAvailableUseCases = () => {
    axios
      .get("http://localhost:3000/usecases")
      .then((response) => {
        setUseCases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Available Use Cases:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeature({
      ...feature,
      [name]: value,
    });
  };

  const handleUseCaseSelection = (useCaseId) => {
    const updatedUseCases = selectedUseCases.includes(useCaseId)
      ? selectedUseCases.filter((id) => id !== useCaseId)
      : [...selectedUseCases, useCaseId];
    setSelectedUseCases(updatedUseCases);
  };

  const handleAddFeature = () => {
    const featureData = {
      name: feature.name,
      description: feature.description,
    };

    axios
      .post("http://localhost:3000/features", featureData)
      .then((featureResponse) => {
        const newFeature = featureResponse.data.feature;
        const useCaseIds = selectedUseCases;

        if (useCaseIds.length > 0) {
          const createRelationPromises = useCaseIds.map((useCaseId) => {
            return axios
              .post("http://localhost:3000/feature-use-case-relations", {
                featureId: newFeature.id,
                useCaseId: useCaseId, // Corrected property name
              })
              .then((relationResponse) => {
                console.log(
                  `Relation created for Feature ${newFeature.id} and Use Case ${useCaseId}`
                );
                return relationResponse;
              })
              .catch((error) => {
                console.error(
                  `Error creating relation for Feature ${newFeature.id} and Use Case ${useCaseId}:`,
                  error
                );
                throw error; // Re-throw the error to handle it later
              });
          });

          Promise.all(createRelationPromises)
            .then((relationResponses) => {
              console.log("Feature and use case associations created:", relationResponses);
            })
            .catch((error) => {
              console.error("Error creating feature-use-case relations:", error);
            });
        }

        console.log("Feature added successfully:", newFeature);
        setFeature({
          name: "",
          description: "",
        });
        setSelectedUseCases([]);
      })
      .catch((error) => {
        console.error("Error adding Feature:", error);
      });
  };

  return (
    <div>
      <h2>Add Feature</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={feature.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={feature.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <h3>Assign Use Cases:</h3>
        <ul>
          {useCases.map((useCase) => (
            <li key={useCase.id}>
              <label>
                <input
                  type="checkbox"
                  value={useCase.id}
                  checked={selectedUseCases.includes(useCase.id)}
                  onChange={() => handleUseCaseSelection(useCase.id)}
                />
                {useCase.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Assigned Use Cases:</h3>
        <ul>
          {useCases
            .filter((useCase) => selectedUseCases.includes(useCase.id))
            .map((useCase) => (
              <li key={useCase.id}>{useCase.name}</li>
            ))}
        </ul>
      </div>
      <button onClick={handleAddFeature}>Add Feature</button>
    </div>
  );
}

export default AddFeature;
