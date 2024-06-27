const express = require("express");
const router = express.Router();
// product routes.
const {
  addProduct,
  allProduct,
  getProduct,
  deletProduct,
  updateProduct,
  addReview,
  menProducts,
  womenProducts,
  kidsProducts,
  randomProducts,
} = require("../controller/product.Controller");
const { protect, isAdmin } = require("../middleware/auth.middleware");
const ExpressFormidable = require("express-formidable");

router.post("/addProduct", protect, isAdmin, ExpressFormidable(), addProduct);
router.put(
  "/updateProduct/:id",
  protect,
  isAdmin,
  ExpressFormidable(),
  updateProduct
);
router.get("/men-products", menProducts);
router.get("/women-products", womenProducts);
router.get("/kids-products", kidsProducts);
router.get("/allproduct", allProduct);
router.get("/product/:id", getProduct);
router.delete("/delete/:id", deletProduct);
router.post("/product/:id/review", protect, addReview);
router.get("/randomproducts", randomProducts);
module.exports = router;
