import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Handle input changes for each form section
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    section: string
  ) => {
    const { name, value } = event.target;
    if (section === "personalDetails") {
      setPersonalDetails((prev) => ({ ...prev, [name]: value }));
    } else if (section === "address") {
      setAddress((prev) => ({ ...prev, [name]: value }));
    } else if (section === "paymentInfo") {
      setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Perform form validation here if needed

    // Prepare data for submission
    const orderData = {
      personalDetails,
      address,
      paymentInfo,
    };

    // Implement your order submission logic here
    console.log("Order Placed:", orderData);

    // Redirect or show confirmation message as needed
    alert("Order placed successfully!");
    navigate("/"); // Redirect to homepage or confirmation page
  };

  // Handle order cancellation
  const handleCancel = () => {
    navigate("/cart"); // Redirect back to the cart page
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Personal Details</legend>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={personalDetails.name}
              onChange={(e) => handleInputChange(e, "personalDetails")}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={personalDetails.email}
              onChange={(e) => handleInputChange(e, "personalDetails")}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={personalDetails.phone}
              onChange={(e) => handleInputChange(e, "personalDetails")}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Address</legend>
          <label>
            Street:
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={(e) => handleInputChange(e, "address")}
              required
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={(e) => handleInputChange(e, "address")}
              required
            />
          </label>
          <label>
            State:
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={(e) => handleInputChange(e, "address")}
              required
            />
          </label>
          <label>
            Postal Code:
            <input
              type="text"
              name="postalCode"
              value={address.postalCode}
              onChange={(e) => handleInputChange(e, "address")}
              required
            />
          </label>
          <label>
            Country:
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={(e) => handleInputChange(e, "address")}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Payment Information</legend>
          <label>
            Card Number:
            <input
              type="text"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={(e) => handleInputChange(e, "paymentInfo")}
              required
            />
          </label>
          <label>
            Expiry Date (MM/YY):
            <input
              type="text"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={(e) => handleInputChange(e, "paymentInfo")}
              required
            />
          </label>
          <label>
            CVV:
            <input
              type="text"
              name="cvv"
              value={paymentInfo.cvv}
              onChange={(e) => handleInputChange(e, "paymentInfo")}
              required
            />
          </label>
        </fieldset>

        <div style={{ marginTop: "20px" }}>
          <button type="button" onClick={handleCancel} style={{ marginRight: "10px" }}>
            Cancel Order
          </button>
          <button type="submit">Place Order</button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;