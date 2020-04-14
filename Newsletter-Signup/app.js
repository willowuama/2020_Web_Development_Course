//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
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

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  };

  const listID = process.env.LISTID;
  const apiKey = process.env.APIKEY;
  const jsonData = JSON.stringify(data);
  const url = `https://us19.api.mailchimp.com/3.0/lists/${listID}`

  const options = {
    method: "POST",
    auth: `BigWill:${apiKey}`
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

})

app.post('/failure', function(req,res){
  res.redirect('/');
})

// Launch Server
app.listen(process.env.PORT || port,function(){
  console.log(`Server started on port ${port}`);
})
