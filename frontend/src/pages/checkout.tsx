import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QMNsDEbIUYKEOl9F5f6497Nhqmo4SSN00IqCBBaGPWJ4gjV7k7g702RndLhoPIqyarmHrE0omnlcdTZfvJDPTty00nEoyDfmK");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateField = (field: string, value: string) => {
    const validators = {
      name: (val: string) => /^[A-Za-z ]{3,}$/.test(val),
      email: (val: string) =>
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com)$/.test(val),
      phone: (val: string) => /^\d{10}$/.test(val),
      postalCode: (val: string) => /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(val),
      country: (val: string) => /^[A-Za-z]{2,}$/.test(val), // Ensure a valid country name or code
    };
    return validators[field as keyof typeof validators]
    ? validators[field as keyof typeof validators](value)
    : true;
  
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    section: string
  ) => {
    const { name, value } = event.target;
    if (section === "personalDetails") {
      setPersonalDetails((prev) => ({ ...prev, [name]: value }));
    } else if (section === "address") {
      setAddress((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.entries({ ...personalDetails, ...address }).forEach(([key, value]) => {
      if (!validateField(key, value)) {
        newErrors[key] = `${key} is invalid or required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!stripe || !elements) {
      console.error("Stripe is not loaded");
      return;
    }

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const paymentMethodResponse = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
        billing_details: {
          name: personalDetails.name,
          email: personalDetails.email,
          phone: personalDetails.phone,
          address: {
            line1: address.street,
            city: address.city,
            state: address.state,
            postal_code: address.postalCode,
            country: address.country, // Ensure this is a valid country code like "US", "CA"
          },
        },
      });

      if (paymentMethodResponse.error) {
        console.error(paymentMethodResponse.error.message);
        setErrors({ stripe: paymentMethodResponse.error.message || "Payment failed." });
        setIsProcessing(false);
        return;
      }

      console.log("Payment method created:", paymentMethodResponse.paymentMethod);

      // Send payment method ID to your server for further processing (e.g., creating a payment intent)
      // For now, simulate success and redirect
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error("Error during Stripe payment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <Input
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={(e) => handleInputChange(e, "address")}
          required
        />
        <Input
          type="text"
          name="state"
          placeholder="State"
          value={address.state}
          onChange={(e) => handleInputChange(e, "address")}
          required
        />
        <Input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={(e) => handleInputChange(e, "address")}
          required
        />
        <Input
          type="text"
          name="country"
          placeholder="Country (e.g., US, CA)"
          value={address.country}
          onChange={(e) => handleInputChange(e, "address")}
          required
        />
      </div>
      {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

      <h2 className="text-lg font-semibold mb-2">PAYMENT</h2>
      <CardElement options={{ hidePostalCode: true }} />

      <Button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Submit Payment"}
      </Button>
    </form>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <div className="max-h-screen p-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">CHECKOUT</h1>
        </CardHeader>
        <CardContent>
          <CheckoutForm />
        </CardContent>
      </Card>
    </div>
  </Elements>
);

export default Checkout;
