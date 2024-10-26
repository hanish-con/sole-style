// Products.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const response = await fetch("http://localhost:3002/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setProducts(data);
      } catch (error: any) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <br />
      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <h2>Name: {product.name}</h2>
              <p>Description: {product.description}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              {product.images.length > 0 && (
                <img src={product.images[0]} alt={product.name} width="500" />
              )}
              <br />
              <Link to={`/products/${product._id}`}>View Details</Link> {/* Link to ProductDetails */}
            </div>
          ))}
        </div>
      ) : (
        <div>No products available</div>
      )}
    </div>
  );
}
