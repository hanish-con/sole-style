import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the CartItem schema
const cartItemSchema = new Schema({
  cartId: {
    type: Schema.Types.ObjectId,
    ref: 'Cart', // Assuming you have a Cart model
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Assuming you have a Product model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

// module.exports = mongoose.model('CartItem', cartItemSchema);
export const CartItem = mongoose.model('CartItem', cartItemSchema);
