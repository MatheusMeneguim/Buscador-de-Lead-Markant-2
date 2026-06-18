const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    default: null,
    trim: true,
  },
  rating: {
    type: Number,
    default: null,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  website: {
    type: String,
    default: null,
    trim: true,
  },
  nicho: {
    type: String,
    required: true,
    trim: true,
  },
  cidade: {
    type: String,
    required: true,
    trim: true,
  },
  // Dono do lead — quem criou
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ownerUsername: {
    type: String,
    required: true,
  }
}, { timestamps: true })

module.exports = mongoose.model('Lead', leadSchema)