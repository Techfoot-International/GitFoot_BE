import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function CheckDetailsUseCase() {
  const { id } = useParams();
  const [useCase, setUseCase] = useState(null);
  const [selectedDomainObjects, setSelectedDomainObjects] = useState([]);
  const [availableDomainObjects, setAvailableDomainObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDomainObjectSelect = (e) => {
    const selectedDomainObjectId = e.target.value;
    if (!selectedDomainObjects.includes(selectedDomainObjectId)) {
      setSelectedDomainObjects([
        ...selectedDomainObjects,
        selectedDomainObjectId,
      ]);
    }
  };

  const handleRemoveDomainObject = (domainObjectId) => {
    const updatedDomainObjects = selectedDomainObjects.filter(
      (objectId) => objectId !== domainObjectId
    );
    setSelectedDomainObjects(updatedDomainObjects);
  };

  const handleUpdateUseCase = () => {
    // Send a PUT request to update the use case details
    axios
      .put(`http://localhost:3000/usecase/${id}`, {
        name: useCase.name,
        description: useCase.description,
        actors: useCase.actors,
        preConditions: useCase.preConditions,
        postConditions: useCase.postConditions,
        objectives: useCase.objectives,
        steps: useCase.steps,
        testCases: useCase.testCases,
        domainObjects: selectedDomainObjects,
      })
      .then((response) => {
        alert("Use Case details updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating use case details:", error);
        alert("Failed to update use case details. Please try again.");
      });
  };

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const response = await axios.get(`http://localhost:3000/usecase/${id}`);
        setUseCase(response.data);

        // Fetch available domain objects here
        const domainObjectsResponse = await axios.get(
          "http://localhost:3000/domainobject"
        );
        setAvailableDomainObjects(domainObjectsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching use case details:", error);
        setError("Failed to fetch use case details");
        setLoading(false);
      }
    };

    fetchData(id);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="use-case-details-container">
      <h2>Edit Use Case Details</h2>
      <form>
        <label>Name:</label>
        <input
          type="text"
          value={useCase.name}
          onChange={(e) => setUseCase({ ...useCase, name: e.target.value })}
        />
        <label>Description:</label>
        <input
          type="text"
          value={useCase.description}
          onChange={(e) => setUseCase({ ...useCase, description: e.target.value })}
        />
        <label>Actors:</label>
        <input
          type="text"
          value={useCase.actors}
          onChange={(e) => setUseCase({ ...useCase, actors: e.target.value })}
        />
        <label>Pre-Conditions:</label>
        <input
          type="text"
          value={useCase.preConditions}
          onChange={(e) => setUseCase({ ...useCase, preConditions: e.target.value })}
        />
        <label>Post-Conditions:</label>
        <input
          type="text"
          value={useCase.postConditions}
          onChange={(e) => setUseCase({ ...useCase, postConditions: e.target.value })}
        />
        <label>Objectives:</label>
        <input
          type="text"
          value={useCase.objectives}
          onChange={(e) => setUseCase({ ...useCase, objectives: e.target.value })}
        />
        <label>Steps:</label>
        <textarea
          value={useCase.steps}
          onChange={(e) => setUseCase({ ...useCase, steps: e.target.value })}
        />
        <label>Test Cases:</label>
        <input
          type="text"
          value={useCase.testCases}
          onChange={(e) => setUseCase({ ...useCase, testCases: e.target.value })}
        />
        <h3 className="section-heading">Selected Domain Objects:</h3>
        <ul>
          {selectedDomainObjects.map((domainObjectId, index) => (
            <li key={index}>
              {domainObjectId}{" "}
              <button onClick={() => handleRemoveDomainObject(domainObjectId)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="domain-object-dropdown">
          <label>Select Domain Object:</label>
          <select value="" onChange={handleDomainObjectSelect}>
            <option value="" disabled>
              Select a Domain Object
            </option>
            {availableDomainObjects.map((domainObject) => (
              <option key={domainObject.id} value={domainObject.id}>
                {domainObject.name}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={handleUpdateUseCase}>
          Update
        </button>
        <Link to="/view-usecases" className="go-back-button">
          Go Back
        </Link>
      </form>
    </div>
  );
}

export default CheckDetailsUseCase;
