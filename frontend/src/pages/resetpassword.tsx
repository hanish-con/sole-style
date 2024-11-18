import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null); // Reset previous errors
    setLoading(true); // Start loading

    // Reset password API call
    try {
      const response = await resetPassword(email, password); // Assuming resetPassword takes email and new password

      if (response) {
        setMessage("Password reset successfully.");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after successful reset
        }, 2000);
      } else {
        setError("Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while resetting the password.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    // <div className="reset-password-container">
    //   <h2>Reset Your Password</h2>
    //   <form onSubmit={handleResetPassword}>
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

    //     <div>
    //       <label htmlFor="password">New Password:</label>
    //       <input
    //         type="password"
    //         id="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>

    //     <div>
    //       <label htmlFor="confirmPassword">Confirm New Password:</label>
    //       <input
    //         type="password"
    //         id="confirmPassword"
    //         value={confirmPassword}
    //         onChange={(e) => setConfirmPassword(e.target.value)}
    //         required
    //       />
    //     </div>

    //     {error && <p className="error-message">{error}</p>}
    //     {message && <p className="success-message">{message}</p>}

    //     <button type="submit" disabled={loading}>
    //       {loading ? "Resetting..." : "Reset Password"}
    //     </button>
    //   </form>
    // </div>
    <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg shadow-md mt-10">
    <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>
    {message ? (
      <p className="text-green-600 text-center">Your password has been reset successfully.</p>
    ) : (
      <form onSubmit={handleResetPassword}>
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
        <div className="mb-4">
          <Label htmlFor="password">New Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="mt-1"
          />
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    )}
  </div>
  );
};

export default ResetPassword;
