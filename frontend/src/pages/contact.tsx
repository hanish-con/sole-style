import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import * as Toast from "@radix-ui/react-toast";
import { sendContactMessage } from "@/utils/api";


const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validateName = (name: string): boolean => /^[A-Za-z ]{3,}$/.test(name);
  const validateEmail = (email: string): boolean =>
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com)$/.test(email);
  const validateMessage = (message: string): boolean => message.trim().length >= 10;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.name)) {
      newErrors.name = "Name must be at least 3 characters long.";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!validateMessage(formData.message)) {
      newErrors.message = "Message must be at least 10 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const result = await sendContactMessage(formData); // Send data to backend API

    setLoading(false);
    if (result.success) {
      setShowToast(true);
      setFormData({ name: "", email: "", message: "" }); // Clear form
    } else {
      alert(result.message); // Show failure message
    }
  };

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={showToast}
          onOpenChange={setShowToast}
          className="fixed border border-green-500 rounded-lg shadow-lg p-6 text-gray-900 z-50"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            backgroundColor: "#E8F5E9",
            color: "#1B5E20",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Toast.Title className="font-bold text-xl">🎉 Message Sent!</Toast.Title>
          <Toast.Description className="mt-2 text-sm">
            Thank you for reaching out to us. We’ll get back to you soon.
          </Toast.Description>
          <Toast.Close className="absolute top-2 right-2" aria-label="Close">
            ✕
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Contact Us</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <Textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                required
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
