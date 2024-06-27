const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("./model/product.model");

const dummyData = [
  {
    productName: "Men's Product 1",
    Brand: "Nike",
    productDetails: "Details about Men's Product 1",
    price: 100,
    avlStock: 10,
    stars: 4.5,
    count: 10,
    category: "Men",
    quantity: 1,
    imagePath: "images/men_product1.jpg",
    reviews: [],
  },
  {
    productName: "Men's Product 2",
    Brand: "Adidas",
    productDetails: "Details about Men's Product 2",
    price: 120,
    avlStock: 15,
    stars: 4.0,
    count: 8,
    category: "Men",
    quantity: 1,
    imagePath: "images/men_product2.jpg",
    reviews: [],
  },
  {
    productName: "Men's Product 3",
    Brand: "zara",
    productDetails: "Details about Men's Product 3",
    price: 80,
    avlStock: 20,
    stars: 3.5,
    count: 12,
    category: "Men",
    quantity: 1,
    imagePath: "images/men_product3.jpg",
    reviews: [],
  },
  {
    productName: "Men's Product 4",
    Brand: "Puma",
    productDetails: "Details about Men's Product 4",
    price: 150,
    avlStock: 5,
    stars: 4.8,
    count: 5,
    category: "Men",
    quantity: 1,
    imagePath: "images/men_product4.jpg",
    reviews: [],
  },
  {
    productName: "Women's Product 1",
    Brand: "Nike",
    productDetails: "Details about Women's Product 1",
    price: 90,
    avlStock: 8,
    stars: 4.2,
    count: 6,
    category: "Women",
    quantity: 1,
    imagePath: "images/women_product1.jpg",
    reviews: [],
  },
  {
    productName: "Women's Product 2",
    Brand: "Zara",
    productDetails: "Details about Women's Product 2",
    price: 110,
    avlStock: 12,
    stars: 4.6,
    count: 7,
    category: "Women",
    quantity: 1,
    imagePath: "images/women_product2.jpg",
    reviews: [],
  },
  {
    productName: "Women's Product 3",
    Brand: "Adidaas",
    productDetails: "Details about Women's Product 3",
    price: 100,
    avlStock: 18,
    stars: 3.9,
    count: 10,
    category: "Women",
    quantity: 1,
    imagePath: "images/women_product3.jpg",
    reviews: [],
  },
  {
    productName: "Women's Product 4",
    Brand: "Puma",
    productDetails: "Details about Women's Product 4",
    price: 130,
    avlStock: 14,
    stars: 4.3,
    count: 9,
    category: "Women",
    quantity: 1,
    imagePath: "images/women_product4.jpg",
    reviews: [],
  },
  {
    productName: "Kids' Product 1",
    Brand: "NIke",
    productDetails: "Details about Kids' Product 1",
    price: 50,
    avlStock: 25,
    stars: 4.1,
    count: 15,
    category: "Kids",
    quantity: 1,
    imagePath: "images/kids_product1.jpg",
    reviews: [],
  },
  {
    productName: "Kids' Product 2",
    Brand: "Adidas",
    productDetails: "Details about Kids' Product 2",
    price: 60,
    avlStock: 30,
    stars: 3.8,
    count: 20,
    category: "Kids",
    quantity: 1,
    imagePath: "images/kids_product2.jpg",
    reviews: [],
  },
  {
    productName: "Kids' Product 3",
    Brand: "puma",
    productDetails: "Details about Kids' Product 3",
    price: 70,
    avlStock: 22,
    stars: 4.0,
    count: 18,
    category: "Kids",
    quantity: 1,
    imagePath: "images/kids_product3.jpg",
    reviews: [],
  },
  {
    productName: "Kids' Product 4",
    Brand: "xara",
    productDetails: "Details about Kids' Product 4",
    price: 55,
    avlStock: 28,
    stars: 4.4,
    count: 11,
    category: "Kids",
    quantity: 1,
    imagePath: "images/kids_product4.jpg",
    reviews: [],
  },
];

async function seedProducts() {
  try {
    await Product.deleteMany();

    const productsWithImages = dummyData.map((product) => {
      const imagePath = path.join(__dirname, product.imagePath);
      const imageBuffer = fs.readFileSync(imagePath);
      return {
        ...product,
        image: {
          data: imageBuffer,
          contentType: "image/jpg",
        },
      };
    });

    await Product.insertMany(productsWithImages);
    console.log("Products inserted successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

module.exports = seedProducts;
