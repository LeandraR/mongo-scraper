var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title: String,
    note: String
});

var Notes = mongoose.model("scraper", NoteSchema);


module.exports = Notes;