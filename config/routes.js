// Routes
// ======
ar express = require("express");
var router = express.Router();

var request = require("request");
var cheerio = require("cheerio");

var Article = require("../models/Article");
var Note = require("../models/Note");


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
