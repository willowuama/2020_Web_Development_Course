//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homeStartingContent = "Welcome to my Blog Project using node.js and ejs!";

const aboutContent = "This is a simple implementation of a blog site. I used Node.js and Express.js for backend framework. For the database I used MongoDB and EJS for the frontend.";

const contactContent = "If you want to contact me just look me up on your favorite platform @willowuama";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Global
const posts = [];

// Connect to DB
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Blog Shema
const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  postBody: {
    type: String,
    required: true
  }
});

// Blog Model
const Blog = mongoose.model('Blog', blogSchema);

// Render Home Page
app.get('/', function(req, res){

  Blog.find({}, (err, foundBlogs) => {
    if(!err){
      res.render('home', {homeContent: homeStartingContent, posts: foundBlogs});
    }else{
      console.log(err);
    }
  })

  //res.render('home', {homeContent: homeStartingContent, posts: posts});
})

// Render About Page
app.get('/about', function(req, res){
  res.render('about', {aboutContent: aboutContent});
})

// Render Contact Page
app.get('/contact', function(req, res){
  res.render('contact', {contactContent: contactContent});
})

//Render Compose Page
app.get('/compose', function(req, res){
  res.render('compose');
})

// Compose POST req
app.post('/compose', function(req, res){

  const newPost = new Blog({
    title: req.body.postTitle,
    postBody: req.body.postBody
  });

  newPost.save();
  res.redirect("/");

})

// Render individual posts
app.get('/posts/:postId', function(req, res){

  const postId = req.params.postId;

  Blog.find({_id: postId}, (err, foundBlog) => {
    if(!err){
      res.render('post', {postTitle: foundBlog[0].title, postBody: foundBlog[0].postBody})
    }else{
      console.log(err);
    }
  })


})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
