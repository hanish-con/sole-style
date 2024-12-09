import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com)$/, 
  },
  message: {
    type: String,
    required: true,
    minlength: 10,
  }
});

export const Contact = mongoose.model('Contact', contactSchema);
