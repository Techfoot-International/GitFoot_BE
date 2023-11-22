import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const [productDetails, setProductDetails] = useState(null);
  const { productId } = useParams();
  const [selectedModules, setSelectedModules] = useState([]);
  const [editableName, setEditableName] = useState("");
  const [editableDescription, setEditableDescription] = useState("");
  const [modules, setModules] = useState([]);
  const [editedModules, setEditedModules] = useState([]); // To track changes to modules
  const [selectedModule, setSelectedModule] = useState("");

  useEffect(() => {
    // Load product details and available modules when the component mounts.
    axios
      .get(`http://localhost:3000/products/${productId}`)
      .then((response) => {
        setProductDetails(response.data);
        setEditableName(response.data.name);
        setEditableDescription(response.data.description);
        // Set the initially assigned modules in the selectedModules state
        if (Array.isArray(response.data.modules)) {
          setSelectedModules(response.data.modules.map((module) => module.name));
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });

    axios
      .get("http://localhost:3000/modules") // Replace with the correct API endpoint
      .then((response) => {
        setModules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Available Modules:", error);
      });
  }, [productId]);

  const handleModuleSelection = (event) => {
    setSelectedModule(event.target.value);
  };

  const handleAssignModule = () => {
    if (selectedModule && !selectedModules.includes(selectedModule)) {
      setSelectedModules([...selectedModules, selectedModule]);
      setEditedModules([...editedModules, selectedModule]); // Track changes
    }
  };

  const handleUpdateModules = async () => {
    // Convert module names back to module IDs
    const moduleIds = modules
      .filter((module) => selectedModules.includes(module.name))
      .map((module) => module.id);

    if (moduleIds.length > 0) {
      try {
        const response = await axios.post(
          `http://localhost:3000/products/${productId}/assign-modules`,
          {
            moduleIds: moduleIds,
          }
        );

        console.log("Modules assigned successfully:", response.data);
        setSelectedModules([]); // Clear the selected modules
        setEditedModules([]); // Clear the changes
        // You can handle success here
        // After successful assignment, you might want to refresh product details.
      } catch (error) {
        console.error("Error assigning modules:", error);
        // Handle the error
      }
    }
  };

  // Function to save the edited product details
  const handleSaveProductDetails = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/products/${productId}`,
        {
          name: editableName,
          description: editableDescription,
        }
      );
      console.log("Product details updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating product details:", error);
      console.log("Response Data:", error.response.data);
    }
  };

  if (productDetails) {
    return (
      <div>
        <h2>Product Details</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                />
              </td>
              <td>
                <textarea
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={handleSaveProductDetails}>Save</button>
        <h3>Assign Modules</h3>
        <table>
          <thead>
            <tr>
              <th>Module Name</th>
            </tr>
          </thead>
          <tbody>
            {selectedModules.map((moduleName) => (
              <tr key={moduleName}>
                <td>{moduleName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <select value={selectedModule} onChange={handleModuleSelection}>
          <option value="">Select a Module</option>
          {modules.map((module) => (
            <option key={module.id} value={module.name}>
              {module.name}
            </option>
          ))}
        </select>
        <button onClick={handleAssignModule}>Assign Module</button>
        <button onClick={handleUpdateModules}>Update Modules</button>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Product Details</h2>
        <p>Product not found or an error occurred.</p>
      </div>
    );
  }
}

export default ProductDetails;
