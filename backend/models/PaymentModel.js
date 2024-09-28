const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Payment schema
const paymentSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order', // Assuming you have an Order model
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
