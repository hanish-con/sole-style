import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/utils/api"; // Ensure the correct path for forgotPassword function
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Forgot password API call
    try {
      const response = await forgotPassword(email); // Assuming forgotPassword takes email

      if (response) {
        setMessage("Password reset link sent to your email.");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after sending reset link
        }, 2000);
      } else {
        setError("Failed to send reset link.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while sending the reset link.");
    }
  };

  return (
    // <div className="forgot-password-container">
    //   <h2>Forgot Your Password?</h2>
    //   <form onSubmit={handleForgotPassword}>
    //     <div>
    //       <label htmlFor="email">Email:</label>
    //       <input
    //         type="email"
    //         id="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //     </div>

    //     {error && <p className="error-message">{error}</p>}
    //     {message && <p className="success-message">{message}</p>}

    //     <button type="submit">Send Reset Link</button>
    //   </form>
    // </div>
    <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg shadow-md mt-10">
    <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>
    {message ? (
      <p className="text-green-600 text-center">
        A reset link has been sent to your email.
      </p>
    ) : (
      <form onSubmit={handleForgotPassword}>
        <div className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
      </form>
    )}
  </div>
  );
};

export default ForgotPassword;
