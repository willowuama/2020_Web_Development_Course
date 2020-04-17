//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");
const Schema = mongoose.Schema;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const port = 3000;


// Database
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Schemas
const itemsSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

const listSchema = new Schema({
  name: String,
  items: [itemsSchema]
});

// Models
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

// Test Data

const item1 = new Item({
  name: "Test"
});

const item2 = new Item({
  name: "Test 2"
});

const item3 = new Item({
  name: "Test 3"
});

const defaultItems = [item1, item2, item3];

// EJS Config
app.set('view engine', 'ejs');

//Render Home Page
app.get('/', function(req,res){

Item.find({}, function(err, foundItems){

  res.render('list', {listTitle: "Today", newListItems: foundItems})

});

})

// Render custom list pages i.e. /work
app.get('/:customListName', (req, res) => {
  const customListName =  _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, (err, foundList) => {
    if(!err){
      if(!foundList){
        // Create a new list
        const list = new List({
          name: customListName
        });

        list.save()
        res.redirect(`/${customListName}`)

      }else {
        // Show an existing list
        res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })

})



// Add new item form
app.post('/', (req,res) =>{
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect(`/${listName}`);
    })
  }


})

// Delete item from Page
app.post("/delete", (req, res) => {

  const deleteId = req.body.deleteItem;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(deleteId, (err, item) =>{
      if(err){
        console.log(err);
      }else{
        console.log(`${item} removed from the db`);
      }
    })

    res.redirect("/");
  }else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteId}}}, (err, foundList) => {
      if(!err){
        console.log(`${deleteId} removed from ${listName} list`);
        res.redirect(`/${listName}`);
      }
    })
  }


})


//Launch server
app.listen(port, function(){
  console.log(`Server started on port ${port}`);
})
