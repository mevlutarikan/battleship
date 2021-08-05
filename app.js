var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const session = require('express-session');
const io = require('./utils/socketio')(app);

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();
app.use(cors({ credentials: true, maxAge: 600000 }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'reactapp', 'build')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000000,
    },
  })
);

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
