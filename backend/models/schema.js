import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "User",
    enum: ["Admin", "User"],
  },

});

export const User = mongoose.model("User", UserSchema);
