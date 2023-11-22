import React, { useState, useEffect } from "react";
import axios from "axios";

function AddUsecase() {
  const [usecase, setUsecase] = useState({
    name: "",
    description: "",
    objectives: "",
    actors: "",
    preConditions: "",
    postConditions: "",
    steps: [],
    testCases: [],
    picture: null,
    assignedDomainObjects: [],
  });

  const [domainObjects, setDomainObjects] = useState([]);
  const [selectedDomainObject, setSelectedDomainObject] = useState(null);

  useEffect(() => {
    loadDomainObjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsecase({
      ...usecase,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setUsecase({
      ...usecase,
      picture: e.target.files[0],
    });
  };

  const handleStepChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSteps = [...usecase.steps];
    updatedSteps[index][name] = value;
    setUsecase({ ...usecase, steps: updatedSteps });
  };

  const handleAddStep = () => {
    setUsecase({
      ...usecase,
      steps: [
        ...usecase.steps,
        { name: "", description: "" },
      ],
    });
  };

  const handleTestCaseChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTestCases = [...usecase.testCases];
    updatedTestCases[index][name] = value;
    setUsecase({ ...usecase, testCases: updatedTestCases });
  };

  const handleAddTestCase = () => {
    setUsecase({
      ...usecase,
      testCases: [
        ...usecase.testCases,
        { name: "", description: "" },
      ],
    });
  };

  const handleAssignDomainObject = () => {
    if (selectedDomainObject) {
      setUsecase({
        ...usecase,
        assignedDomainObjects: [...usecase.assignedDomainObjects, selectedDomainObject],
      });
      setSelectedDomainObject(null);
    }
  };

  const handleAddUsecase = () => {
    const assignedDomainObjectIds = usecase.assignedDomainObjects.map((obj) => obj.id);

    const steps = usecase.steps.map((step) => ({ name: step.name, description: step.description }));
    const testCases = usecase.testCases.map((testCase) => ({
      name: testCase.name,
      description: testCase.description,
    }));

    const usecaseData = {
      ...usecase,
      assignedDomainObjectIds,
      steps,
      testCases,
    };

    axios
      .post("http://localhost:3000/usecases", usecaseData)
      .then((response) => {
        console.log("Usecase added successfully:", response.data);
        setUsecase({
          name: "",
          description: "",
          objectives: "",
          actors: "",
          preConditions: "",
          postConditions: "",
          steps: [],
          testCases: [],
          picture: null,
          assignedDomainObjects: [],
        });
      })
      .catch((error) => {
        console.error("Error adding Usecase:", error);
      });
  };

  const loadDomainObjects = () => {
    axios
      .get("http://localhost:3000/domainobject")
      .then((response) => {
        setDomainObjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Domain Objects:", error);
      });
  };

  return (
    <div>
      <h2>Add Usecase</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={usecase.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={usecase.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Actors:</label>
        <input
          type="text"
          name="actors"
          value={usecase.actors}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Pre-Conditions:</label>
        <input
          type="text"
          name="preConditions"
          value={usecase.preConditions}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Post-Conditions:</label>
        <input
          type="text"
          name="postConditions"
          value={usecase.postConditions}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Steps:</label>
        {usecase.steps.map((step, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              placeholder="Step Name"
              value={step.name}
              onChange={(e) => handleStepChange(e, index)}
            />
            <input
              type="text"
              name="description"
              placeholder="Step Description"
              value={step.description}
              onChange={(e) => handleStepChange(e, index)}
            />
          </div>
        ))}
        <button onClick={handleAddStep}>Add Step</button>
      </div>
      <div>
        <label>Test Cases:</label>
        {usecase.testCases.map((testCase, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              placeholder="Test Case Name"
              value={testCase.name}
              onChange={(e) => handleTestCaseChange(e, index)}
            />
            <input
              type="text"
              name="description"
              placeholder="Test Case Description"
              value={testCase.description}
              onChange={(e) => handleTestCaseChange(e, index)}
            />
          </div>
        ))}
        <button onClick={handleAddTestCase}>Add Test Case</button>
      </div>
      <div>
        <label>Picture:</label>
        <input type="file" name="picture" onChange={handleFileChange} />
      </div>
      <div>
        <h3>Assign Domain Objects</h3>
        <select
          value={selectedDomainObject ? selectedDomainObject.id : ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selected = domainObjects.find((obj) => obj.id === Number(selectedId));
            setSelectedDomainObject(selected);
          }}
        >
          <option value="">-- Select Domain Object --</option>
          {domainObjects.map((domainObject) => (
            <option key={domainObject.id} value={domainObject.id}>
              {domainObject.name}
            </option>
          ))}
        </select>
        <button onClick={handleAssignDomainObject}>Assign</button>
      </div>
      <div>
        <h3>Assigned Domain Objects</h3>
        <ul>
          {usecase.assignedDomainObjects.map((domainObject) => (
            <li key={domainObject.id}>{domainObject.name}</li>
          ))}
        </ul>
      </div>
      <button onClick={handleAddUsecase}>Add Usecase</button>
    </div>
  );
}

export default AddUsecase;
