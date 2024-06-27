const Product = require("../model/product.model.js");
const fs = require("fs");

// adding new product
const addProduct = async (req, res) => {
  try {
    const {
      productName,
      Brand,
      productDetails,
      price,
      avlStock,
      stars,
      count,
      category,
      quantity,
    } = req.fields;
    const { image } = req.files;

    // Validate required fields
    if (
      !productName ||
      !Brand ||
      !productDetails ||
      !price ||
      !avlStock ||
      !category ||
      !image ||
      image.size > 1000000
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Create new product
    const newProduct = new Product({
      productName,
      Brand,
      productDetails,
      price,
      avlStock,
      stars,
      count,
      category,
      quantity,
    });

    // Handle image upload
    if (image) {
      newProduct.image.data = fs.readFileSync(image.path);
      newProduct.image.contentType = image.type;
    }

    // Save product to database
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// fetching all product
const allProduct = async (req, res) => {
  try {
    const products = await Product.find({});

    // update  product to include base64 image
    const modifiedProducts = products.map((product) => {
      const imageBase64 = product.image.data
        ? product.image.data.toString("base64")
        : "";
      return {
        ...product._doc,
        image: imageBase64
          ? `data:${product.image.contentType};base64,${imageBase64}`
          : "",
      };
    });

    res.status(200).json({ success: true, products: modifiedProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//get product. by id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Convert image to base64
    const imageBase64 = product.image.data
      ? product.image.data.toString("base64")
      : "";
    const modifiedProduct = {
      ...product._doc,
      image: imageBase64
        ? `data:${product.image.contentType};base64,${imageBase64}`
        : "",
    };

    res.status(200).json({ success: true, product: modifiedProduct });
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// delete product controller
const deletProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
// update product controller
const updateProduct = async (req, res) => {
  try {
    const {
      productName,
      Brand,
      productDetails,
      price,
      avlStock,
      stars,
      count,
      category,
      quantity,
    } = req.fields;
    const { image } = req.files;

    // Validate required fields
    if (
      !productName ||
      !Brand ||
      !productDetails ||
      !price ||
      !avlStock ||
      !category
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find the existing product by ID
    let existingProduct = await Product.findById(req.params.id);

    // If product not found
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update fields of the existing product
    existingProduct.productName = productName;
    existingProduct.Brand = Brand;
    existingProduct.productDetails = productDetails;
    existingProduct.price = price;
    existingProduct.avlStock = avlStock;
    existingProduct.stars = stars || existingProduct.stars;
    existingProduct.count = count || existingProduct.count;
    existingProduct.category = category;
    existingProduct.quantity = quantity || existingProduct.quantity;

    // Handle image upload if image is included
    if (image) {
      existingProduct.image.data = fs.readFileSync(image.path);
      existingProduct.image.contentType = image.type;
    }

    // Save updated product to database
    await existingProduct.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: existingProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// added review ..

const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Product already reviewed" });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.count = product.reviews.length;
      product.stars =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// updates men's product
const menProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: "Men" });

    // Modify each product to include base64 image
    const modifiedProducts = products.map((product) => {
      const imageBase64 = product.image.data
        ? product.image.data.toString("base64")
        : "";
      return {
        ...product._doc,
        image: imageBase64
          ? `data:${product.image.contentType};base64,${imageBase64}`
          : "",
      };
    });

    res.status(200).json({ success: true, products: modifiedProducts });
  } catch (error) {
    console.error("Error fetching men products:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
// fetchwomen products..
const womenProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: "Women" });

    // Modify each product to include base64 image
    const modifiedProducts = products.map((product) => {
      const imageBase64 = product.image.data
        ? product.image.data.toString("base64")
        : "";
      return {
        ...product._doc,
        image: imageBase64
          ? `data:${product.image.contentType};base64,${imageBase64}`
          : "",
      };
    });

    res.status(200).json({ success: true, products: modifiedProducts });
  } catch (error) {
    console.error("Error fetching men products:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
//fetch women product
const kidsProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: "Kids" });

    // Modify each product to include base64 image
    const modifiedProducts = products.map((product) => {
      const imageBase64 = product.image.data
        ? product.image.data.toString("base64")
        : "";
      return {
        ...product._doc,
        image: imageBase64
          ? `data:${product.image.contentType};base64,${imageBase64}`
          : "",
      };
    });

    res.status(200).json({ success: true, products: modifiedProducts });
  } catch (error) {
    console.error("Error fetching kids products:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
// fetch random product

const randomProducts = async (req, res) => {
  try {
    // Fetch up to 8 random products with all details
    const products = await Product.aggregate([
      { $sample: { size: 8 } }, // Adjust the size based on how many random products you want
    ]);

    // Modify each product to include base64 image and other necessary details
    const modifiedProducts = products.map((product) => ({
      _id: product._id,
      productName: product.productName,
      Brand: product.Brand,
      productDetails: product.productDetails,
      price: product.price,
      avlStock: product.avlStock,
      stars: product.stars,
      count: product.count,
      category: product.category,
      image: product.image.data
        ? `data:${
            product.image.contentType
          };base64,${product.image.data.toString("base64")}`
        : "",
    }));

    res.status(200).json({ success: true, products: modifiedProducts });
  } catch (error) {
    console.error("Error fetching random products:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
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
};
