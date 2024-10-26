// src/pages/product-details.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const [product, setProduct] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/products/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch product details");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Product Details</h1>
      {product && (
        <div className="product-details">
          <h2>Name: {product.name}</h2>
          <p>Description: {product.description}</p>
          <p>Category: {product.category}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Stock: {product.stock}</p>
          <p>Created At: {new Date(product.createdAt).toLocaleDateString()}</p>
          <p>Updated At: {new Date(product.updatedAt).toLocaleDateString()}</p>
          {product.images.length > 0 && (
            <img src={product.images[0]} alt={product.name} width="500" />
          )}
        </div>
      )}
    </div>
  );
}
