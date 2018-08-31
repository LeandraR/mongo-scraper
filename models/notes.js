var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title: String,
    note: String,
    articleId: String
});

var Note = mongoose.model("scraper", NoteSchema);


module.exports = Note;