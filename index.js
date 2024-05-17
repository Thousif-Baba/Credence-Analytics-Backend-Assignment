require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.log('Error connecting to MongoDB', err);
        process.exit(1);
    });

const bookSchema = new mongoose.Schema({
    name: String,
    img: String,
    summary: String
});

const Book = mongoose.model('apis', bookSchema);

app.post('/api/books', async (req, res) => {
    try {
        console.log('Creating a new book with data:', req.body);
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (err) {
        console.error('Error creating book:', err);
        res.status(400).json({ message: err.message });
    }
});

app.get('/api/books', async (req, res) => {
    try {
        console.log('Fetching all books');
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/books/:id', async (req, res) => {
    try {
        console.log(`Fetching book with ID: ${req.params.id}`);
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/books/:id', async (req, res) => {
    try {
        console.log(`Updating book with ID: ${req.params.id}`);
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/books', async (req, res) => {
    try {
        console.log('Deleting all books');
        const deletedBooks = await Book.deleteMany({});
        res.json({ message: `${deletedBooks.deletedCount} books deleted` });
    } catch (err) {
        console.error('Error deleting books:', err);
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        console.log(`Deleting book with ID: ${req.params.id}`);
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted' });
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
