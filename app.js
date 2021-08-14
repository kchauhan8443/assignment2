var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bookRouter = require('./routes/books');

const passport = require('passport');
const session = require('express-session');
const githubStrategy = require('passport-github2').Strategy;
const config = require('./config/globals');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'kapilSearchassignment2',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user');
passport.use(User.createStrategy());
passport.use(new githubStrategy(
  {
    clientID: config.github.clientId,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ oauthId: profile.id });
    if (user) {
      return done(null, user);
    }
    else {
      const newUser = new User(
        {
          username: profile.username,
          oauthId: profile.id,
          oauthProvider: 'Github',
          created: Date.now()
        }        
      );
      const savedUser = await newUser.save();

      return done(null, savedUser);
    }
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/books', bookRouter);


const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://kapil:kapil@cluster0.qoefx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log('Connected successfully!');
  })
  .catch((err) => {
    console.log(err);
  });

const hbs = require('hbs');

hbs.registerHelper('createOption', (currentValue, selectedValue) => {
  var selectedAttribute = '';
  if (currentValue == selectedValue) {
    selectedAttribute = 'selected'
  }
  return new hbs.SafeString("<option " + selectedAttribute +">" + currentValue + "</option>");
});

hbs.registerHelper('toShortDate', (longDateValue) =>{
  return new hbs.SafeString(longDateValue.toLocaleDateString('en-CA'));
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
