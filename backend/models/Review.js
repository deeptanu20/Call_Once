const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    images: [{ type: String }], 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);