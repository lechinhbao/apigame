var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require("mongoose");


const indexRouter = require('./routes/index');
const userAPIRouter = require('./routes/api/user');
const productAPIRouter = require('./routes/api/product');
const userCpanelRouter = require('./routes/cpanel/user');
const productCpanelRouter = require('./routes/cpanel/Product');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect("mongodb+srv://lechinhbao3477:03040509@knightsadventure.wjl5tfn.mongodb.net/?retryWrites=true&w=majority",  {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));


// http://localhost:3000/
app.use('/', indexRouter);
// http://localhost:3000/api/user
app.use('/api/user', userAPIRouter);
// http://localhost:3000/api/product
app.use('/api/product', productAPIRouter);
// http://localhost:3000/cpanel/user
app.use('/cpanel/user', userCpanelRouter);
// http://localhost:3000/cpanel/product
app.use('/cpanel/product', productCpanelRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
