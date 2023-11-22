import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ViewProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch products from the server
    axios
      .get("http://localhost:3000/products") // Update the URL to your server
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div>
      <h2>View Products</h2>
      <Link to="/add-product" className="new-button">
        NEW
      </Link>

      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>
                <Link to={`/product-details/${product.id}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewProducts;
