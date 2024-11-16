import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toast } from "@radix-ui/react-toast";

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateName = (name: string): boolean => /^[A-Za-z ]{3,}$/.test(name);
  const validateEmail = (email: string): boolean =>/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com)$/.test(email);
  const validatePostalCode = (postalCode: string): boolean => /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(postalCode);
  const validatePhone = (phone: string): boolean => /^\d{10}$/.test(phone);
  const validateCardNumber = (cardNumber: string): boolean => /^\d{16}$/.test(cardNumber);
  const validateCVV = (cvv: string): boolean => /^\d{3}$/.test(cvv);
  const validateExpiryDate = (expiryDate: string): boolean => /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
  const validateAddressField = (value: string) => /^[A-Za-z\s]{3,}$/.test(value);



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
    setErrors((prev)=>({...prev,[name]:""}));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Record<string,string>={};
    if (!validateName(personalDetails.name)) {
      newErrors.name = "Name must be at least 3 characters and contain only letters.";
    }
    if (!validateEmail(personalDetails.email)) {
      newErrors.email = "Enter a valid email (e.g., @gmail.com, @yahoo.com).";
    }
    if (!validatePhone(personalDetails.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!validateAddressField(address.street)) {
      newErrors.street = "Street must be at least 3 characters and contain only letters.";
    }
    if (!validateAddressField(address.city)) {
      newErrors.city = "City must be at least 3 characters and contain only letters.";
    }
    if (!validateAddressField(address.state)) {
      newErrors.state = "State must be at least 3 characters and contain only letters.";
    }
    if (!validatePostalCode(address.postalCode)) {
      newErrors.postalCode = "Postal code must follow ANA NAN format (e.g., K1A 0T6).";
    }
    if (!validateAddressField(address.country)) {
      newErrors.country = "Country must be at least 3 characters and contain only letters.";
    }
    if (!validateCardNumber(paymentInfo.cardNumber)) {
      newErrors.cardNumber = "Card number must be exactly 16 digits.";
    }
    if (!validateCVV(paymentInfo.cvv)) {
      newErrors.cvv = "CVV must be exactly 3 digits.";
    }
    if (!validateExpiryDate(paymentInfo.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format (e.g., 08/25).";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission
    const orderData = {
      personalDetails,
      address,
      paymentInfo,
      cartItems: JSON.parse(localStorage.getItem("cart") || "[]"),
      totalAmount: 20, // neeed to update
      shippingMethod: "CreditCard",
    };
    try {
      const response = await fetch("http://localhost:3002/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order.");
      }
  
      const data = await response.json();
      console.log("Order placed successfully:", data);
      
  
      // Clear cart and navigate to the homepage
      localStorage.removeItem("cart");
      setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error placing order:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } 
  };

  // Handle order cancellation
  const handleCancel = () => {
    navigate("/cart"); // Redirect back to the cart page
  };

  return (
    <div className="max-h-screen p-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">CHECKOUT</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">PERSONAL DETAILS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={personalDetails.name}
                onChange={(e) => handleInputChange(e, "personalDetails")}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={personalDetails.email}
                onChange={(e) => handleInputChange(e, "personalDetails")}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <Input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={personalDetails.phone}
                onChange={(e) => handleInputChange(e, "personalDetails")}
                required
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">ADDRESS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                name="street"
                placeholder="Street"
                value={address.street}
                onChange={(e) => handleInputChange(e, "address")}
                required
              />
              {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
              <Input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={(e) => handleInputChange(e, "address")}
                required
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              <Input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={(e) => handleInputChange(e, "address")}
                required
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
              <Input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={address.postalCode}
                onChange={(e) => handleInputChange(e, "address")}
                required
              />
              {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
              <Input
                type="text"
                name="country"
                placeholder="Country"
                value={address.country}
                onChange={(e) => handleInputChange(e, "address")}
                required
              />
              {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">PAYMENT INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChange={(e) => handleInputChange(e, "paymentInfo")}
                required
              />
              {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
              <Input
                type="text"
                name="expiryDate"
                placeholder="Expiry Date (MM/YY)"
                value={paymentInfo.expiryDate}
                onChange={(e) => handleInputChange(e, "paymentInfo")}
                required
              />
              {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
              <Input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={paymentInfo.cvv}
                onChange={(e) => handleInputChange(e, "paymentInfo")}
                required
              />
              {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleCancel} variant="outline">
          Cancel Order
        </Button>
        <Button onClick={handleSubmit}>PLACE ORDER</Button>
      </CardFooter>
    </Card>
  </div>
  );
};

export default Checkout;