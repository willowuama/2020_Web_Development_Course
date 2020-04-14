//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const port = 3000;

var items = [];

// EJS Config
app.set('view engine', 'ejs');

//Render Home Page
app.get('/', function(req,res){

let day = date.getDate();

  res.render('list', {kindOfDay: day, newListItems: items});
})

// Add new item form
app.post('/', (req,res) =>{
  var item = req.body.newItem;
  items.push(item);
  res.redirect("/");
})

//Launch server
app.listen(port, function(){
  console.log(`Server started on port ${port}`);
})
