const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String },
  scrapedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
