import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/utils/api"; // Ensure the correct path for forgotPassword function

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
    <div className="forgot-password-container">
      <h2>Forgot Your Password?</h2>
      <form onSubmit={handleForgotPassword}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
