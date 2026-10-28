const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
    },
    category: {
        type: String,
        enum: ["Story Telling", "Computer Science", "Biography"],
    },
    availability: {
        type: Boolean,
    },
});

const bookModel = mongoose.model("Book", bookSchema);

module.exports = bookModel;
