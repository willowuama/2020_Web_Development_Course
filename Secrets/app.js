//jshint esversion:6

require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

// Server configuration
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Passport Configuration
app.use(session({
  secret: "What it do hoe",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Database configuration
const dbURL = "mongodb://localhost:27017/userDB"
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

// User Schema
const userSchema = new Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

// User Model

const User = new mongoose.model('User', userSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Render home page
app.get('/', (req, res) => {
  res.render('home');
})

// Render login page
app.get('/login', (req, res) => {
  res.render('login');
})

// Render register page
app.get('/register', (req, res) => {
  res.render('register');
})

// Render secrets page
app.get('/secrets', (req, res) => {
  if(req.isAuthenticated()){
    res.render('secrets');
  }else{
    res.redirect('/login');
  }
})

// Register new user
app.post('/register', (req, res) => {
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      res.redirect('/register');
    }else{
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets');
      })
    }
  })
})

// Login a user
app.post('/login', (req, res) => {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, (err) => {
    if(err){
      console.log(err);
      res.redirect('/login');
    }else{
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets');
      })
    }
  })
})

// Log User out
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})


// Launch Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
