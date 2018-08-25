var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');
var Note = require('./models/notes.js');
var Article = require('./models/articles.js');

mongoose.Promise = Promise;

var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapedArticles");
var db = mongoose.connection;

db.on("error", function (error) {
    console.log("Mongoose Error: " + error);
});

db.once("open", function () {
    console.log("Mongoose connection successful.");
});

// mongoose routes

app.get("/scrape", function (req, res) {
    request("https://news.ycombinator.com/", function (error, response, html) {

        if (error){
            console.log(error)
        }
        var $ = cheerio.load(html);
        $('.storylink').each(function (i, element) {
            console.log("hello");
            var result = {};
            result.headline = $(this).text();
            result.link = $(this).attr("href");
            // $('p.summary').each(function (i, element) {
            //     var result = {};
            //     result.summary = $(this).children("a").text();
            // })
            console.log("result");
            var entry = new Article(result);


            entry.save(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            });
        });


    });
    res.redirect("index.html");
});

//{favorite = true}b
app.get("/article", function (req, res) {
    Article.find({}, function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

app.get("/favourites", function (req, res) {
    Article.find({favorite : true}, function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

//looks for note field in article collection, passes id value
app.get("/article/:id", function (req, res) {
    Article.findOne({
            "_id": req.params.id
        })
        .populate("note")
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.json(doc);
            }
        });
});

app.post("/article/:id", function (req, res) {
    console.log(req.body);
    var newNote = new Note(req.body);
    newNote.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.send(doc);
        }
    });
});

app.listen(3000, function () {
    console.log("Running on port 3000");
})