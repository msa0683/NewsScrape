var express = require("express");
var app = express();
var exphbs  = require('express-handlebars');

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

mongoose.Promise = Promise;

app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.use(bodyParser());
// app.configure(function(){
//
//   app.use(app.router);
// });

app.use(express.static("public"));

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

// Routes
// ======

app.get("/", function(req, res) {
  Article.find({}, function (err, doc) {
    res.render('index', {articles: doc})
  })
});

app.get("/scrape", function(req, res) {
  request("https://www.nytimes.com", function(err, response, html) {
    var $ = cheerio.load(html);
    $("article h2").each(function(i, element) {
      var result = {};
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.saveState = false;
      var entry = new Article(result);
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }

      });

    });
  });
  res.send("Scrape Complete");
});

app.get("/saved", function(req, res) {
  Article.find({saveState:true}, function(err, doc) {
    if (err) throw err
    else {
      console.log(doc)
      res.render("saved", {articles: doc});
    }
  });
})

app.get("/article/:id/save", function (req, res) {
  Article.findOneAndUpdate({"_id": req.params.id}, {$set: {"saveState": true}}, function (err, doc) {
    if (err) throw err
    else {
      res.redirect('/');
    }
  })
})

app.get("/article/:id/delete",function(req, res) {
  Article.findOneAndUpdate({"_id": req.params.id}, {$set: {"saveState": false}}, function (err, doc) {
    if(err) throw err
    else {
      res.redirect("/saved");
    }

  })
})

app.post("/notes/:article_id", function(req, res) {
  var newNote = new Note(req.body)
  newNote.save(function(err, note) {
    console.log(note)
    if (err) throw err
    else {
      Article.findOneAndUpdate({"_id" : req.params.article_id}, {$set: {"note" : note}}, function (err, doc) {
        res.redirect('/saved');
      })
    }
  })
})


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!")
});
