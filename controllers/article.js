
// Bring in our scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

var Article = require("../models/Article");

module.exports = {
  fetch: function(cb) {

    scrape(function(data) {

      var article = data;

      for (var i = 0; i < article.length; i++) {
        article[i].date = makeDate();
        article[i].saved = false;
      }

      Article.collection.insertMany(article, { ordered: false }, function(err, docs) {
        cb(err, docs);
      });
    });
  },
  delete: function(query, cb) {
    Article.remove(query, cb);
  },
  get: function(query, cb) {


    Article.find(query)
      .sort({
        _id: -1
      })

      .exec(function(err, doc) {
        cb(doc);
      });
  },
  update: function(query, cb) {


    Article.update({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
};
