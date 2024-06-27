const mongoose = require("mongoose");
// product model schema
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  Brand: { type: String, required: true },
  productDetails: { type: String, required: true },
  price: { type: Number, required: true },
  avlStock: { type: Number, required: true },
  stars: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  category: { type: String, required: true },
  quantity: { type: Number },
  image: {
    data: Buffer,
    contentType: String,
  },
  reviews: [reviewSchema],
  timeStamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
