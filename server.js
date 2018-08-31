var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');
var Note = require('./models/notes.js');
var Article = require('./models/articles.js');


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapedArticles";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


var app = express();


app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

// mongoose.connect("mongodb://localhost/scrapedArticles");
var db = mongoose.connection;

db.on("error", function (error) {
    console.log("Mongoose Error: " + error);
});

db.once("open", function () {
    console.log("Mongoose connection successful.");
});


//scraping route
app.get("/scrape", function (req, res) {
    request("https://news.ycombinator.com/news", function(
      error,
      response,
      html
    ) {
      if (error) {
        console.log(error);
      }
      var $ = cheerio.load(html);
      $(".storylink").each(function(i, element) {
        // console.log("hello");
        var result = {};
        result.headline = $(this).text();
        result.link = $(this).attr("href");
        // $('p.summary').each(function (i, element) {
        //     var result = {};
        //     result.summary = $(this).children("a").text();
        // })
        console.log("result");
        var entry = new Article(result);

        entry.save(function(err, doc) {
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

//get articles
app.get("/article", function (req, res) {
    Article.find({}, function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

//post new note
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

app.get("/notes-articles/:id", function (req, res) {
    console.log(req.body);
    Note.find({
        "articleId": req.params.id
    },
        function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc);
            res.send(doc);
        }
    });
});
//app.delete route to remove notes

app.delete("/notes-article/:id", function (req, res) {
    console.log(req.params.id);
    Note.remove({
        "_id": req.params.id
    },
    function(err, doc){
        if (err){
            console.log(err);
        } else {
            console.log(doc);
            res.send(doc);
        }
    });
});

app.get("/article/:id", function (req, res) {
    console.log(req.body);
    Article.find(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc);
            res.send(doc);
        }
    });
});

//find favourites = true
app.get("/favourites", function (req, res) {
    Article.find({favorite : true}, function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

//update favourite to true
app.post("/favourites/:id", function (req, res) {
    console.log(req.params);
            // Use the article id to find and update its saved boolean
            Article.findOneAndUpdate({
                    "_id": req.params.id
                }, {

                    //TODO: how to change
                    "favorite": true
                })
                // Execute the above query
                .exec(function (err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    } else {
                        // Or send the document to the browser
                        res.send(doc);
                    }
                });
            });app.post("/favourites/:id", function (req, res) {
    console.log(req.params);
            // Use the article id to find and update its saved boolean
            Article.findOneAndUpdate({
                    "_id": req.params.id
                }, {

                    //TODO: how to change
                    "favorite": true
                })
                // Execute the above query
                .exec(function (err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    } else {
                        // Or send the document to the browser
                        res.send(doc);
                    }
                });
            });

//TODO: cleaner way to do this rather than create a new route??

app.post("/removefavourites/:id", function (req, res) {
    Article.findOneAndUpdate({
            "_id": req.params.id
        }, {
            "favorite": false
        })
        // Execute the above query
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            } else {
                // Or send the document to the browser
                res.send(doc);
            }
        });
});






app.listen(3000, function () {
    console.log("Running on port 3000");
})