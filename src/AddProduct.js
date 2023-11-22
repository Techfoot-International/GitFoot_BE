import React, { useState, useEffect } from "react";
import axios from "axios";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    selectedModules: [],
  });

  const [modules, setModules] = useState([]);

  useEffect(() => {
    // Load available modules when the component mounts.
    loadAvailableModules();
  }, []);

  const loadAvailableModules = () => {
    axios
      .get("http://localhost:3000/modules")
      .then((response) => {
        setModules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Available Modules:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleModuleSelection = (moduleId) => {
    const selectedModules = product.selectedModules.includes(moduleId)
      ? product.selectedModules.filter((id) => id !== moduleId)
      : [...product.selectedModules, moduleId];
    setProduct({ ...product, selectedModules });
  };

  const handleAddProduct = () => {
    const productData = {
      name: product.name,
      description: product.description,
    };

    axios
      .post("http://localhost:3000/products", productData)
      .then((productResponse) => {
        const newProduct = productResponse.data.product;
        const moduleIds = product.selectedModules;

        if (moduleIds.length > 0) {
          axios
            .post("http://localhost:3000/product-module-relations", {
              productId: newProduct.id,
              moduleIds: moduleIds,
            })
            .then((relationResponse) => {
              console.log("Product and module associations created:", relationResponse.data);
            })
            .catch((error) => {
              console.error("Error creating product-module relations:", error);
            });
        }

        console.log("Product added successfully:", newProduct);
        setProduct({
          name: "",
          description: "",
          selectedModules: [],
        });
      })
      .catch((error) => {
        console.error("Error adding Product:", error);
      });
  };

  return (
    <div>
      <h2>Add Product</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <h3>Assign Modules:</h3>
        <ul>
          {modules.map((module) => (
            <li key={module.id}>
              <label>
                <input
                  type="checkbox"
                  value={module.id}
                  checked={product.selectedModules.includes(module.id)}
                  onChange={() => handleModuleSelection(module.id)}
                />
                {module.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Assigned Modules:</h3>
        <ul>
          {modules
            .filter((module) => product.selectedModules.includes(module.id))
            .map((module) => (
              <li key={module.id}>{module.name}</li>
            ))}
        </ul>
      </div>
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
}

export default AddProduct;
