import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toast } from "@radix-ui/react-toast";
import { deleteCartItem, deleteCartItemById, createOrder } from "@/utils/api";

// Stripe integration imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Stripe public key
const stripePromise = loadStripe("pk_test_51QMNsDEbIUYKEOl9F5f6497Nhqmo4SSN00IqCBBaGPWJ4gjV7k7g702RndLhoPIqyarmHrE0omnlcdTZfvJDPTty00nEoyDfmK");


const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalAmount = location.state?.totalAmount || 0;
  //  const { cartItems, totalAmount } = location.state || {};

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  //  const user = JSON.parse(localStorage.getItem('user'));

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

  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const validateName = (name: string): boolean => /^[A-Za-z ]{3,}$/.test(name);
  const validateEmail = (email: string): boolean => /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com)$/.test(email);
  const validatePostalCode = (postalCode: string): boolean => /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(postalCode);
  const validatePhone = (phone: string): boolean => /^\d{10}$/.test(phone);
  // const validateCardNumber = (cardNumber: string): boolean => /^\d{16}$/.test(cardNumber);
  //const validateCVV = (cvv: string): boolean => /^\d{3}$/.test(cvv);
  //const validateExpiryDate = (expiryDate: string): boolean => /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
  //  const validateAddressField = (value: string) => /^[A-Za-z\s]{3,}$/.test(value);
  const validateAddressField = (value: string) => /^[A-Za-z0-9\s,.'-]{3,}$/.test(value);
  



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
    }
    // else if (section === "paymentInfo") {
    //   setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    // }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};
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
      newErrors.street = "Street must be at least 3 characters and contain valid characters.";
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
    // if (!validateCardNumber(paymentInfo.cardNumber)) {
    //   newErrors.cardNumber = "Card number must be exactly 16 digits.";
    // }
    // if (!validateCVV(paymentInfo.cvv)) {
    //   newErrors.cvv = "CVV must be exactly 3 digits.";
    // }
    // if (!validateExpiryDate(paymentInfo.expiryDate)) {
    //   newErrors.expiryDate = "Expiry date must be in MM/YY format (e.g., 08/25).";
    // }

    // If there are validation errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if Stripe and Elements are loaded
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;
    setLoading(true);
    try {
      // Create Payment Method with Stripe
      const { token, error } = await stripe.createToken(cardElement);
      if (error) {
        throw new Error(error.message || "Payment method creation failed.");
      }

      // Prepare data for submission
      const orderData = {
        email: user.email, // to track the user
        personalDetails,
        address,
        paymentInfo,
        cartItems: JSON.parse(localStorage.getItem("cart") || "[]"),
        totalAmount,
        shippingMethod: "CreditCard",
        paymentToken: token.id,  // Add the token from Stripe
      };

      const currency = "CAD";

      //  const response = await createOrder(orderData.totalAmount, currency, orderData.paymentToken);
      const response = await createOrder(
        orderData.totalAmount,    // amount
        currency,                 // currency
        orderData.paymentToken,   // paymentToken
        orderData.personalDetails, // personalDetails
        orderData.address,         // address
        orderData.paymentInfo,     // paymentInfo (ensure it's passed)
        orderData.cartItems,
        orderData.email,
      );
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to place order.");
      // }
      if (response === null) {
        throw new Error("Failed to place order.");
      }

      //    const data = await response.json();
      // console.log("Order placed successfully:", response);

      JSON.parse(localStorage.getItem("cart") || "[]").forEach(async x => {
        const deletedCartItem = await deleteCartItemById(x, user.email);
        // console.log({ deleted: deletedCartItem });
      });
      // Clear cart and navigate to the homepage
      localStorage.removeItem("cart");
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error placing order:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
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

            {/* <div>
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
          </div> */}

            <div className="">
              <h2 className="text-lg font-semibold mb-2">PAYMENT DETAILS</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <CardElement options={{ hidePostalCode: true }} />
                {errors.card && <p className="text-red-500 text-sm">{errors.card}</p>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleCancel} variant="outline">
            Cancel Order
          </Button>
          {/* <Button onClick={handleSubmit}>
            PLACE ORDER
          </Button> */}
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            { loading ? "Processing..." : 
              <span className="flex align-items-center gap-2"><FontAwesomeIcon icon={faMoneyBill} />{ `Pay ${totalAmount.toFixed(2)} CAD` }</span>
            }
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Checkout;