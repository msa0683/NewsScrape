// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // article, a string, must be entered
  article: {
    type: String,
    required: true,
    unique: true
  },
  // summary, a string, must be entered
  summary: {
    type: String,
    required: true
  },
  // date is just a string
  date: String,
  saved: {
    type: Boolean,
    default: false
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
