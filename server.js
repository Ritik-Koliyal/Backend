const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.route");
const cors = require("cors");
const productRoute = require("./routes/product.routes");
const orderRoutes = require("./routes/Order.route");
const bodyParser = require("body-parser");
const seedProducts = require("./Seedar");
const seedUsers = require("./UserSeedar");
require("dotenv").config(); // Ensure to load environment variables
console.log("MongoDB URL:", process.env.MONGODB_URL);
const PORT = process.env.PORT || 2100;
const app = express();

mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.on("connected", async () => {
  console.log("Connected to MongoDB");

  // Call the seeder functions
  await seedProducts();
  await seedUsers();
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(express.json());
app.use("/api", userRoute);
app.use("/api", productRoute);
app.use("/api", orderRoutes);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
