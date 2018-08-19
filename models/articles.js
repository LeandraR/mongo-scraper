var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var ArticleSchema = new Schema({
    headline: {
        type: String,
        unique: true
    },
    summary: {
        type: String,
        required:true
    },
    link: {
            type: String,
            required: true
        },
    note: {
            type: Schema.Types.ObjectId,
            ref: "Note"
        },
    favorite: {
        type: Boolean,
        default:false
    }
});


var Article = mongoose.model("scrapedArticles", ArticleSchema);

module.exports = Article;
