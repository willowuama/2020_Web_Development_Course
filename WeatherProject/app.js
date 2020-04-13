//jshint esversion:6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;

// Get index.html at root address
app.get("/", function(req,res){
  res.sendFile(__dirname + "/index.html")
})

// Post users zipcode to get Weather Data
app.post('/', function(req,res){
  const zip = req.body.zipcode;
  const appKey = "72a35dd9f7f2975ea2c2ed99567eb609"
  const units = "imperial"
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=${units}&appid=${appKey}`

  // Weather Data HTTPS Request
  https.get(url, function(response){
    console.log(response.statusCode);

    response.on('data', function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`
      const currentCity = weatherData.name
      res.write(`<h1>The Temperature in ${currentCity} is ${temp} degrees Fahrenheit</h1>`)
      res.write(`<image src="${imgURL}"/>`)
      res.write(`<p>The weather is currently ${description}</p>`)
      res.send()

    })
  })

})

// Launch Server on port 3000
app.listen(port, function(){
  console.log(`Server started on port ${port}`);
})
