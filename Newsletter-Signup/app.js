//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true})); // Needed to parse response
app.use(express.static('public')); // needed to load static files

// ROUTE: Homepage to signup.html
app.get('/', function(req, res){
  res.sendFile(__dirname + "/signup.html");
})

// POST singup.html
app.post('/', function(req,res){
  const fName = req.body.fName
  const lName = req.body.lName
  const email = req.body.email

  console.log(`Testing ${fName} ${lName} ${email}`)
})

// Launch Server
app.listen(port,function(){
  console.log(`Server started on port ${port}`);
})
