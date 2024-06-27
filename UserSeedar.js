const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./model/user.model");

const dummyUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "qwert",
    address: "123 Main St",
    phone: 1234567890,
    answer: "blue",
    isAdmin: true,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "qwert",
    address: "456 Elm St",
    phone: 9876543210,
    answer: "green",
    isAdmin: true,
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "qwert",
    address: "789 Oak St",
    phone: 1112223333,
    answer: "red",
    isAdmin: false,
  },
  {
    name: "Bob Brown",
    email: "bob@example.com",
    password: "qwert",
    address: "321 Pine St",
    phone: 4445556666,
    answer: "yellow",
    isAdmin: false,
  },
  {
    name: "Charlie White",
    email: "charlie@example.com",
    password: "qwert",
    address: "654 Maple St",
    phone: 7778889999,
    answer: "black",
    isAdmin: false,
  },
  {
    name: "David Green",
    email: "david@example.com",
    password: "qwert",
    address: "987 Birch St",
    phone: 1231231234,
    answer: "white",
    isAdmin: false,
  },
  {
    name: "Eva Blue",
    email: "eva@example.com",
    password: "qwert",
    address: "432 Cedar St",
    phone: 9879879870,
    answer: "purple",
    isAdmin: false,
  },
  {
    name: "Frank Yellow",
    email: "frank@example.com",
    password: "qwert",
    address: "210 Willow St",
    phone: 6546546540,
    answer: "orange",
    isAdmin: false,
  },
];

async function seedUsers() {
  try {
    await User.deleteMany();

    const usersWithHashedPasswords = await Promise.all(
      dummyUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(usersWithHashedPasswords);

    console.log("Users inserted successfully");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
}

module.exports = seedUsers;
