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
  // category: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Category',
  //   required: true
  // },
  category: {
    type: String,
    enum: ["men", "women", "kids"]
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
