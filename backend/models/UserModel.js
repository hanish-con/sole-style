import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


// // Hash the password before saving the user to the database
// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     // Implement password hashing here, e.g., with bcrypt
//     // const salt = await bcrypt.genSalt(10);
//     // user.password = await bcrypt.hash(user.password, salt);
//   }
//   next();
// });

// Create and export the User model
// module.exports = mongoose.model('User', userSchema);
export const User = mongoose.model('User', userSchema);
