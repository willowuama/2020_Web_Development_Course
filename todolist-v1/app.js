//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const Schema = mongoose.Schema;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const port = 3000;


// Database
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

const Item = mongoose.model("Item", itemsSchema);

// item documents to initialize the Database

const item1 = new Item({
  name: "Buy Food"
});

const item2 = new Item({
  name: "Cook Food"
});

const item3 = new Item({
  name: "Eat Food"
});

const defaultItems = [item1, item2, item3];

// EJS Config
app.set('view engine', 'ejs');

//Render Home Page
app.get('/', function(req,res){

let day = date.getDate();

Item.find({}, function(err, foundItems){

  if(foundItems.length === 0){
    Item.insertMany(defaultItems, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Items Saved to the Database");
      }
    });
    res.redirect('/');
  }

  if(err){
    console.log(err);
  }else{
    res.render('list', {kindOfDay: day, newListItems: foundItems});
  }
});

})

// Add new item form
app.post('/', (req,res) =>{
  const itemName = req.body.newItem;

  const newItem = new Item({
    name: itemName
  });

  newItem.save();


  res.redirect("/");
})

// Delete item from Page
app.post("/delete", (req, res) => {
  console.log("Item deleted");
  const deleteId = req.body.deleteItem;

  Item.findByIdAndRemove(deleteId, (err, item) =>{
    if(err){
      console.log(err);
    }else{
      console.log(`${item} removed from the db`);
    }
  })

  res.redirect("/");
})

//Launch server
app.listen(port, function(){
  console.log(`Server started on port ${port}`);
})
