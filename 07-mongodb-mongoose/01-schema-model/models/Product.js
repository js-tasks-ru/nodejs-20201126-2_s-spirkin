const mongoose = require('mongoose');
const connection = require('../libs/connection');

const types = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: types.ObjectId,
    required: true,
  },
  images: [String],
});

module.exports = connection.model('Product', productSchema);
