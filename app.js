const express = require("express");
const connectDB = require("./db");
const bookModel = require("./models/book.model");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("api/books", async (req, res) => {
    try {
        const { title, author, category } = req.body;
        if (!title)
            return res
                .status(400)
                .json({ message: "Please provide the title." });

        const newBook = new bookModel({
            title: title,
            author: author,
            category: category,
        });

        await bookModel.create({
            newBook,
        });
        return res
            .status()
            .json({ message: "New Book is added successfully", newBook });
    } catch (err) {
        return res.status(400).json({ message: "Something went wrong" });
    }
});

app.get("/api/books", async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page, 10) || 1;
        const limit = Number.parseInt(req.query.limit, 10) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                message: "Page and limit must be positive numbers.",
            });
        }

        const skip = (page - 1) * limit;
        const [books, totalBooks] = await Promise.all([
            bookModel.find().skip(skip).limit(limit),
            bookModel.countDocuments(),
        ]);

        return res.status(200).json({
            message: "books fetched successfully",
            books,
            metadata: {
                page,
                limit,
                totalBooks,
                totalPages: Math.ceil(totalBooks / limit),
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Unable to fetch books.",
        });
    }
});

app.patch("/api/books/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const status = req.body.status;
        if (typeof status !== Boolean)
            return res
                .status(400)
                .json({ message: "Type of status should be true or false" });

        const book = await bookModel.findByIdAndUpdate({
            id: id,
            status: status,
        });
        if (!book)
            return res.status(404).json({ message: "Book does not exist" });

        return res
            .status(200)
            .json({ message: "book updated successfully", book });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Unable to find the requested book" });
    }
});

app.listen(3000, () => {
    connectDB();
    console.log("Server is running at PORT 3000");
});
