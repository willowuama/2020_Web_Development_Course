const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;

app.listen(port, function(){
  console.log(`Listening at http://localhost:${port}`)
})

app.get('/', function(req,res){
  res.sendFile(__dirname + "/index.html");
})

app.post('/', function(req,res){
  var n1 = Number(req.body.num1);
  var n2 = Number(req.body.num2);

  var result = n1 + n2;
  res.send(`The result of the calculation is ${result}`);
})

app.get('/bmi', function(req,res){
  res.sendFile(__dirname + '/bmiCalculator.html');
})

app.post('/bmi', function(req,res){
  var h = Number(req.body.h);
  var w = Number(req.body.w);

  var result = (w / (h * h)) * 703;

  res.send(`Your calculated BMI is ${result.toFixed(2)}`);
})
