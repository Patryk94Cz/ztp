const express = require('express');
const Book = require('./bookModel');
const router = express.Router();

// Dodawanie nowego rekordu
router.post('/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).send(book);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Przeglądanie rekordów
router.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [['title', 'ASC']] // Sortowanie po nazwie
    });
    res.status(200).send(books);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Pobieranie pojedynczego rekordu
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.status(200).send(book);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Modyfikacja rekordu
router.put('/books/:id', async (req, res) => {
  try {
    const update = await Book.update(req.body, {
      where: { id: req.params.id }
    });
    if (update) {
      res.send('Book updated');
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Usuwanie rekordu
router.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.destroy({
      where: { id: req.params.id }
    });
    if (book) {
      res.send('Book deleted');
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
