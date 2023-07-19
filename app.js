
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { sequelize } = require('./models/index');
var indexRouter = require('./routes/index');
var bookRoute = require('./routes/books');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force:true });
    console.log("Database connection successful")
  } catch (error) {
    console.log("Error connecting to the database: ", error)
  }
})();



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', bookRoute);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  res.status(404).render('books/not-found');
});

// global errors handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (err.status === 404) {
    res.status(404).render('books/not-found', {err});
  } else {
    err.message = err.message || 'Oops It looks like something went wrong on the server.';
    res.status(err.status || 500).render('books/error', {err});
  }
});

module.exports = app;
