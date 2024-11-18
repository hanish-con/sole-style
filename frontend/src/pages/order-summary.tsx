import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { personalDetails, address, total } = location.state || {};

  if (!personalDetails || !address) {
    return <p>Order details not found. Please return to the checkout.</p>;
  }

  return (
    <div>
      <h1>Order Summary</h1>
      <h3>Shipping Details</h3>
      <p>{`${personalDetails.firstName} ${personalDetails.lastName}`}</p>
      <p>{address.street}</p>
      <p>{address.apt && `${address.apt}`}</p>
      <p>{`${address.city}, ${address.province} ${address.postalCode}`}</p>
      <p>{address.country}</p>

      <h3>Contact Info</h3>
      <p>Email: {personalDetails.email}</p>
      <p>Phone: {personalDetails.phone}</p>

      <h3>Total Paid</h3>
      <p>CAD ${total}</p>

      <button onClick={() => navigate("/")}>Return to Home</button>
    </div>
  );
};

export default OrderSummary;
