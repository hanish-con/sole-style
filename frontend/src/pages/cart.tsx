import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [message, setMessage] = useState("");

  // Fetch data from the /cart API on component mount
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch("http://localhost:3002/cart"); // Make sure the URL matches your backend server
        const data = await response.json(); // Parse JSON response
        setMessage(data.message); // Set the message from the API response
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>{message}</h1> {/* Display the message from the API */}
    </div>
  );
};

export default CartPage;
