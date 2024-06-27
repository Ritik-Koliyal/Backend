const mongoose = require("mongoose");
// order model schema
const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        item_name: { type: String, required: true },
        item_image: { type: String, required: true },
        item_quantity: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "Not accecpt",
      enum: ["Not accecpt", "Processing", "Shipped", "deliverd", "cancel"],
    },
    shippingDetails: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      updateTime: { type: String },
      email: { type: String },
    },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
