const OrderModel = require("../model/Order.model");
const Order = require("../model/Order.model");
const user = require("../model/user.model");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingDetails,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Validate required fields
    if (
      !orderItems ||
      !shippingDetails ||
      !paymentMethod ||
      !itemsPrice ||
      !taxPrice ||
      !shippingPrice ||
      !totalPrice
    ) {
      if (!orderItems)
        if (!shippingDetails)
          if (!paymentMethod)
            if (!itemsPrice)
              if (!taxPrice)
                if (!shippingPrice)
                  if (!totalPrice)
                    return res.status(400).json({
                      message: "Missing required fields",
                      error: "Please provide all required fields",
                    });
    }

    // Convert order item product IDs to ObjectId
    const orderItemsWithObjectId = orderItems.map((item) => ({
      ...item,
      product: mongoose.Types.ObjectId.isValid(item.product)
        ? new mongoose.Types.ObjectId(item.product)
        : null,
    }));

    // Validate product IDs
    for (const item of orderItemsWithObjectId) {
      if (!item.product) {
        console.log("Invalid product ID in order items:", item);
        return res.status(400).json({
          message: "Invalid product ID in order items",
          item,
        });
      }
    }

    // Create new order
    const order = new Order({
      orderItems: orderItemsWithObjectId,
      user: req.user._id, // Assuming user ID is set in req.user
      shippingDetails,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Save order to database
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.send({
      order,
    });
  } else {
    res.status(404).json({
      message: "order not found ",
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.paymentID,
        status: req.body.paymentStatus,
        updateTime: req.body.updateTime,
        email: req.body.email,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: error.message });
  }
};

const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

const allReqorders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate({
        path: "orderItems.product",
        select: "image name", // Populate product name and image
      })
      .populate({
        path: "user",
        select: "name email", // Populate buyer name and email
      })
      .sort({ createdAt: -1 }); // Correct sort order

    res.json(orders);
  } catch (error) {
    console.error("Error while getting orders:", error);
    res.status(500).send({
      message: "Error while getting orders.",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updatePayment,
  myOrders,
  allReqorders,
  updateOrderStatus,
};
