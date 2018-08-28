var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(
    bodyParser.urlencoded({ extended: false })
);
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/feedbuzz";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var exphbs = require('express-handlebars');
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/htmlroutes")(app);

app.get("/scrape", function (req, res) {
    axios.get("https://www.buzzfeednews.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        var result = {};
        $("article").each(function (i, element) {
            result.title = $(this).find("h2").children("a").text();
            result.link = $(this).find("h2").children("a").attr("href");
            result.byline = $(this).find("p").text();

            db.Article.create(result).then(function (dbArticle) {
                console.log(dbArticle);
            }).catch(function (err) {
                return res.json(err);
            });
        }),
        res.send("scrape Complte");
    })
});

//updates article to save page
app.put("/submit", function (req, res) {
    var article = req.body._id;
    db.Article.update({ _id: article }, { $set: { "saved": true } }, function (err, saved) {
        if (err) {
            console.log(err);
        } else (
            console.log("Article Saved")
        )
    })
});

//populates saved articles notes. 
app.get("/saved/:id", function (req, res) {
    db.Artilce.findOne({ _id: req.params.id }).populate("note").then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});
//updates articles note with a new note. 
app.get("/saved/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});
//deletes article note
app.delete("/saved/:id", function (req, res) {
    db.Article.find({ _id: req.params.id }).then(function (dbArticle) {
        return db.Note.remove({ _id: dbArticle._id });
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
})

app.listen(PORT, function () {
    console.log(`App running on http://localhost:${PORT}`)
})