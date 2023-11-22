import React, { useState, useEffect } from "react";
import axios from "axios";

function AddModule() {
  const [module, setModule] = useState({
    name: "",
    description: "",
    useCases: [], // Use this array to store the selected use cases
  });

  const [existingUseCases, setExistingUseCases] = useState([]); // State for existing use cases
  const [selectedUseCase, setSelectedUseCase] = useState(""); // New state for the selected use case

  useEffect(() => {
    loadExistingUseCases(); // Fetch existing use cases when the component mounts
  }, []);

  const loadExistingUseCases = () => {
    // Fetch the list of existing use cases from your API and update the state
    axios
      .get("http://localhost:3000/usecases")
      .then((response) => {
        setExistingUseCases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Existing Use Cases:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModule({
      ...module,
      [name]: value,
    });
  };

  const handleDropdownChange = (e) => {
    setSelectedUseCase(e.target.value); // Update the selected use case
  };

  const handleAssignUseCase = () => {
    if (selectedUseCase) {
      setModule({
        ...module,
        useCases: [...module.useCases, selectedUseCase],
      });
      setSelectedUseCase(""); // Clear the selected use case
    }
  };

  const handleAddModule = () => {
    const moduleData = {
      name: module.name,
      description: module.description,
    };

    // Create the module first
    axios.post("http://localhost:3000/modules", moduleData)
      .then((moduleResponse) => {
        const newModule = moduleResponse.data.module;

        // Associate the selected use cases with the module
        const useCaseIds = module.useCases;
        if (useCaseIds && useCaseIds.length > 0) {
          axios.post("http://localhost:3000/module-usecase-relations", {
            moduleId: newModule.id,
            usecaseIds: useCaseIds,
          })
            .then((relationResponse) => {
              console.log("Module and use case associations created:", relationResponse.data);
            })
            .catch((error) => {
              console.error("Error creating module-usecase relations:", error);
            });
        }

        console.log("Module added successfully:", newModule);
        setModule({
          name: "",
          description: "",
          useCases: [],
        });
        setSelectedUseCase(""); // Clear the selected use case
      })
      .catch((error) => {
        console.error("Error adding Module:", error);
      });
  };

  return (
    <div>
      <h2>Add Module</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={module.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={module.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <h3>Assign Existing Use Cases:</h3>
        <select value={selectedUseCase} onChange={handleDropdownChange}>
          <option value="">-- Select Use Case --</option>
          {existingUseCases.map((useCase) => (
            <option key={useCase.id} value={useCase.id}>
              {useCase.name}
            </option>
          ))}
        </select>
        <button onClick={handleAssignUseCase}>Assign Use Case</button>
      </div>
      <div>
        <h3>Assigned Use Cases:</h3>
        <ul>
          {existingUseCases
            .filter((useCase) => module.useCases.includes(useCase.id))
            .map((useCase) => (
              <li key={useCase.id}>{useCase.name}</li>
            ))}
        </ul>
      </div>
      <button onClick={handleAddModule}>Add Module</button>
    </div>
  );
}

export default AddModule;
