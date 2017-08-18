// Server routes


var scrape = require("../scripts/scrape");

var articleController = require("../controllers/article");
var notesController = require("../controllers/notes");

module.exports = function(router) {

  router.get("/", function(req, res) {
    res.render("home");
  });

  router.get("/saved", function(req, res) {
    res.render("saved");
  });

  router.get("/api/fetch", function(req, res) {

    articleController.fetch(function(err, docs) {
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "No new articles today. Check back tomorrow!"
        });
      }
      else {
        res.json({
          message: "Added " + docs.insertedCount + " new articles!"
        });
      }
    });
  });

  router.get("/api/article", function(req, res) {
    var query = {};
    if (req.query.saved) {
      query = req.query;
    }

    articleController.get(query, function(data) {
      res.json(data);
    });
  });

  router.delete("/api/article/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;

    articleController.delete(query, function(err, data) {
      res.json(data);
    });
  });

  router.patch("/api/article", function(req, res) {

      console.log("*********************" + Object.keys(req))

    articleController.update(req.body, function(err, data) {

      res.json(data);
    });
  });


  router.get("/api/notes/:article_id?", function(req, res) {
    var query = {};
    if (req.params.article_id) {
      query._id = req.params.article_id;
    }


    notesController.get(query, function(err, data) {
      res.json(data);
    });
  });


  router.delete("/api/notes/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;

    notesController.delete(query, function(err, data) {

      res.json(data);
    });
  });


  router.post("/api/notes", function(req, res) {
    notesController.save(req.body, function(data) {

      res.json(data);
    });
  });
};
