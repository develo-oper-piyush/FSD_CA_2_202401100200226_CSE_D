const mongoose = require("mongoose");
const URL = "mongodb://127.0.0.1:27017/BookManagement";

const connectDB = async () => {
    await mongoose.connect(URL);
    console.log("Database connected");
};

module.exports = connectDB;
