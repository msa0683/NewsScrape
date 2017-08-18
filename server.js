var express = require("express");
var app = express();



var exphbs  = require('express-handlebars');
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var router = express.Router();
app.use(router);
require("./config/routes")(router);

var mongoose = require("mongoose");
mongoose.Promise = Promise;

var request = require("request");
var cheerio = require("cheerio");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

app.use(express.static(__dirname + "/public"));


var PORT = process.env.PORT || 3000;


var db = process.env.MONGODB_URI || "mongodb://localhost/mongolab-rectangular-34022";

// Connect mongoose to our database
mongoose.connect(db, function(error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.log(error);
  }
  // Or log a success message
  else {
    console.log("mongoose connection is successful");
  }
});

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});