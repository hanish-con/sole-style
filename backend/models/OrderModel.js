import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  personalDetails: {
    type: Object,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  paymentInfo: {
    type: Object,
    required: true,
  },
  cartItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart', // assuming Cart is a model
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingMethod: {
    type: String,
    default: 'CreditCard',
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export { Order };
