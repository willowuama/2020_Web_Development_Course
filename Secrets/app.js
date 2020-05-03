//jshint esversion:6

require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const encrypt = require("mongoose-encryption");
// Server configuration
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Database configuration
const dbURL = "mongodb://localhost:27017/userDB"
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});

// User Schema
const userSchema = new Schema({
  email: String,
  password: String
});

// Encryption
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

// User Model

const User = new mongoose.model('User', userSchema)

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

// Register new user
app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save((err) => {
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  })
})

// Login a user
app.post('/login', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, foundUser) => {
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === password){
            res.render('secrets');
          }else{
            res.redirct('/login');
          }
        }
      }
  })

})


// Launch Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
