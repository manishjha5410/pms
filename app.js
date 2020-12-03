var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var add_new_category_Router = require('./routes/add-new-category');
var add_new_password_Router = require('./routes/add-new-password');
var view_all_password_Router = require('./routes/view-all-password');
var passwordCategoryRouter = require('./routes/passwordCategory');
var signupRouter = require('./routes/signup');
var joinRouter = require('./routes/join');
var password_detail_Router = require('./routes/password-detail');
var usersRouter = require('./routes/users');

var add_new_category_api_Router = require('./api/add-new-category');
var add_new_password_api_Router = require('./api/add-new-password');
var product_Router = require('./api/product');
var user_api_Router = require('./api/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie:{
    path: '/',
    httpOnly: false,
  },
}));

app.use('/', indexRouter);
app.use('/dashboard',dashboardRouter);
app.use('/add-new-category',add_new_category_Router);
app.use('/add-new-password',add_new_password_Router);
app.use('/passwordCategory',passwordCategoryRouter);
app.use('/password-detail',password_detail_Router);
app.use('/view-all-password',view_all_password_Router);
app.use('/signup',signupRouter);
app.use('/join',joinRouter);
app.use('/users', usersRouter);

app.use('/api/add-new-category',add_new_category_api_Router);
app.use('/api/add-new-password',add_new_password_api_Router);
app.use('/api/product',product_Router);
app.use('/api/user',user_api_Router);


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
  res.status(500).json({
    error: err.status+"Internal server error",
  })
});

module.exports = app;
