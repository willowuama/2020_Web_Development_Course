//jshint esversion:6
const express = require("express");
const app = express();

app.listen(3000, function(){
  console.log("Server started on port 3000");
});

app.get('/', function(req, res){
  res.send('GET request to the homepage');
})

app.post('/', function(req,res){
  res.send('POST request to the homepage');
})
