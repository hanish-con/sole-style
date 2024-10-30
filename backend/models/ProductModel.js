import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ["men", "women", "kids"]
  },
  subcategory: {
    type: String,
    enum: ["winter shoes", "regular shoes"],
    required: true
  },
  sizes: {
    type: [String],
    enum: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  images: [
    {
      type: String 
    }
  ],
  imageURL: {
    type: String,
    default: "https://m.media-amazon.com/images/I/618IK6sSdmL._AC_SY695_.jpg",
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

export const Product = mongoose.model('Product', productSchema);
