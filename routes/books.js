const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

function asyncHandler(cb){
  return async(req,res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      //forward error to global error handler
      next(error)
    }
  }
}

/* render home page. */
router.get('/', asyncHandler(async (req, res)  => {
  const books = await Book.findAll();
  res.render('books/index', {books})

}));


// new book entry
router.get('/new', (req, res) => {
  res.render('books/new-book', { books: {}})
})


//post new book
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try{
      book = await Book.create(req.body);
      res.redirect('/books');
  } catch(error){
    if(errorName = 'SequelizeValidationError'){
      book = await Book.create(req.body);
      res.render("books/new-book", { book: book, errors: error.errors})
    } else {
      throw(error)
    }
  }

}));

// get single book to update
router.get('/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    res.render("books/update-book", {book: book, title: book.title})
  } else {
    res.sendStatus(404);
  }
}));

// update book
router.post('/:id', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book){
      await book.update(req.body);
      book.id = req.params.id;
      res.redirect("/books");
    }else{
      throw error;
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct article gets updated
      res.redirect("/books")
    } else {
      throw error;
    }
  }
}));


// delete book entry
router.post(':/id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    await book.destroy
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
