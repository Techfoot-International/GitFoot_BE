import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function FeatureDetails() {
  const [featureDetails, setFeatureDetails] = useState(null);
  const [useCases, setUseCases] = useState([]);
  const [selectedUseCases, setSelectedUseCases] = useState([]);
  const { featureId } = useParams();

  // Define loadFeatureDetails as a memoized function
  const loadFeatureDetails = useCallback(() => {
    axios
      .get(`http://localhost:3000/features/${featureId}`)
      .then((response) => {
        setFeatureDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feature details:", error);
      });
  }, [featureId]);

  useEffect(() => {
    // Load feature details and available use cases when the component mounts.
    loadFeatureDetails();
    loadAvailableUseCases();
  }, [loadFeatureDetails]);

  const loadAvailableUseCases = () => {
    axios
      .get("http://localhost:3000/usecases") // Replace with the correct API endpoint for use cases
      .then((response) => {
        setUseCases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Available Use Cases:", error);
      });
  };

  const handleUseCaseSelection = (useCaseId) => {
    const updatedUseCases = selectedUseCases.includes(useCaseId)
      ? selectedUseCases.filter((id) => id !== useCaseId)
      : [...selectedUseCases, useCaseId];
    setSelectedUseCases(updatedUseCases);
  };

  const handleAssignUseCases = () => {
    // Send the selected use case IDs to the server to update the relation table
    axios
      .post(`http://localhost:3000/features/${featureId}/assign-usecases`, {
        useCaseIds: selectedUseCases,
      }) // Replace with the correct API endpoint
      .then((response) => {
        console.log("Use cases assigned successfully:", response.data);
        // You can handle success here
        setSelectedUseCases([]);
        // After successful assignment, you might want to refresh feature details.
        loadFeatureDetails();
      })
      .catch((error) => {
        console.error("Error assigning use cases:", error);
        // Handle the error
      });
  };

  if (featureDetails) {
    return (
      <div>
        <h2>Feature Details</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{featureDetails.name}</td>
              <td>{featureDetails.description}</td>
            </tr>
          </tbody>
        </table>

        <h3>Assigned Use Cases</h3>
        <ul>
          {featureDetails.useCases &&
            featureDetails.useCases.map((useCase) => (
              <li key={useCase.id}>{useCase.name}</li>
            ))}
        </ul>

        <h3>Assign Existing Use Cases</h3>
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
        <button onClick={handleAssignUseCases}>Assign Use Cases</button>
      </div>
    );
  } else {
    // Handle the case when featureDetails is not available
    return (
      <div>
        <h2>Feature Details</h2>
        <p>Feature not found or an error occurred.</p>
      </div>
    );
  }
}

export default FeatureDetails;
