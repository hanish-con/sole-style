import React, { useEffect, useState } from "react";

export default function Category() {
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const response = await fetch("http://localhost:3002/category");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch categories");
        }

        const data = await response.json();
        console.log("Fetched categories:", data);
        setCategories(data);
      } catch (error: any) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : categories.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories found</p>
      )}
    </div>
  );
}
