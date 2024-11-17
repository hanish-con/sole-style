import mongoose from 'mongoose';

const Schema = mongoose.Schema;


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
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" }
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
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


export const User = mongoose.model('User', userSchema);
