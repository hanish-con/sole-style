const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the OrderItem schema
const orderItemSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order', // Assuming you have an Order model
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
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
