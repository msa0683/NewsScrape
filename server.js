var express = require("express");
var app = express();

var exphbs  = require('express-handlebars');
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose = require("mongoose");
mongoose.Promise = Promise;

var request = require("request");
var cheerio = require("cheerio");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var PORT = process.env.PORT || 3000;




// // Mongoose
mongoose.connect("mongodb://heroku_dhwzsbth:jbr7vf9k4nck6s6n7frdg8ejt7@ds039145.mlab.com:39145/heroku_dhwzsbth");

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!")
});
