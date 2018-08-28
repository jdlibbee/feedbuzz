var db = require('../models');
module.exports = function (app) {
    //shows all articles from scrape. 
    app.get("/", function (req, res) {
        db.Article.find({}).then(function (dbArticle) {
            res.render("index", { article: dbArticle });
        }).catch(function (err) {
            res.json(err);
        })
    });
    //shows articles saved on page. 
    app.get("/saved", function (req, res) {
        db.Article.find({ saved: true }).then(function (dbArticle) {
            res.render("saved", { article: dbArticle });
        }).catch(function (err) {
            res.json(err);
        });
    })
}