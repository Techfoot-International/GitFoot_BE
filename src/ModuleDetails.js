import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ModuleDetails() {
  const [moduleDetails, setModuleDetails] = useState(null);
  const { moduleId } = useParams();
  const [selectedUseCases, setSelectedUseCases] = useState([]);
  const useCasesRef = useRef(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [existingUseCases, setExistingUseCases] = useState([]);
  const [setAssignedUseCaseDetails] = useState([]);

  useEffect(() => {
    // Fetch module details and existing use cases
    axios
      .get(`http://localhost:3000/modules/${moduleId}`)
      .then((response) => {
        setModuleDetails(response.data);
        setEditedName(response.data.name);
        setEditedDescription(response.data.description);
      })
      .catch((error) => {
        console.error("Error fetching module details:", error);
      });

    axios
      .get(`http://localhost:3000/usecases`)
      .then((response) => {
        setExistingUseCases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching existing use cases:", error);
      });
  }, [moduleId]);

  useEffect(() => {
    // Fetch details of the assigned use cases
    if (selectedUseCases.length > 0) {
      axios
        .get(`http://localhost:3000/usecases`, {
          params: {
            ids: selectedUseCases.join(","),
          },
        })
        .then((response) => {
          setAssignedUseCaseDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching assigned use case details:", error);
        });
    }
  },);

  const handleAssignUseCase = () => {
    const selectedUseCaseId = useCasesRef.current.value;

    if (selectedUseCaseId) {
      if (!selectedUseCases.includes(selectedUseCaseId)) {
        setSelectedUseCases([...selectedUseCases, selectedUseCaseId]);
      }
      useCasesRef.current.value = "";
    }
  };

  const handleUpdateUseCases = async () => {
    if (selectedUseCases.length > 0) {
      try {
        const response = await axios.post(
          `http://localhost:3000/modules/${moduleId}/assign-usecases`,
          {
            usecaseIds: selectedUseCases,
          }
        );

        console.log("Use cases assigned successfully:", response.data);
        setSelectedUseCases([]);
      } catch (error) {
        console.error("Error assigning use cases:", error);
      }
    }
  };

  const handleSaveModuleDetails = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/modules/${moduleId}`,
        {
          name: editedName,
          description: editedDescription,
        }
      );
      console.log("Module details updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating module details:", error);
    }
  };

  if (moduleDetails) {
    return (
      <div>
        <Link
          to="/add-module"
          style={{
            backgroundColor: "#0e61b4",
            color: "#fff",
            padding: "10px 20px",
            textDecoration: "none",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            display: "inline-block",
            marginTop: "20px",
          }}
        >
          New
        </Link>
        <h2>Module Details</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        </div>
        <button onClick={handleSaveModuleDetails}>Save Module Details</button>
        <h3>Assigned Use Cases</h3>
        <table>
          <thead>
            <tr>
              <th>Use Case Name</th>
              <th>Use Case Description</th>
            </tr>
          </thead>
          <tbody>
            {moduleDetails.Usecases &&
              moduleDetails.Usecases.map((usecase) => (
                <tr key={usecase.id}>
                  <td>{usecase.name}</td>
                  <td>{usecase.description}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <h3>Assign Use Cases</h3>
        <select ref={useCasesRef}>
          <option value="">Select a Use Case</option>
          {existingUseCases.map((usecase) => (
            <option key={usecase.id} value={usecase.id}>
              {usecase.name}
            </option>
          ))}
        </select>
        <button onClick={handleAssignUseCase}>Assign Use Case</button>
        <button onClick={handleUpdateUseCases}>Update Use Cases</button>
        <div>
          <h4>Selected Use Cases</h4>
          <ul>
            {selectedUseCases.map((useCaseId) => (
              <li key={useCaseId}>{useCaseId}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Module Details</h2>
        <p>Module not found or an error occurred.</p>
      </div>
    );
  }
}

export default ModuleDetails;
