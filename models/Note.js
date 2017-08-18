// Note model
// ==========


var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var noteSchema = new Schema({

  _articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  // date is just a string
  date: String,
  // as is the noteText
  noteText: String
});

// Create the Note model using the noteSchema
var Note = mongoose.model("Note", noteSchema);

// Export the Note model
module.exports = Note;
