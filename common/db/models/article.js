var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise').Promise;

var ArticleSchema = new Schema({
    id: String,
    title: String,
    body: String,
    image: String,
    imageSource: String,
    css: [String],
    js: [String],
    shareUrl: String
});

var ArticleDAO = function () {
    
};

var Article = mongodb.mongoose.model('Article', ArticleSchema);

ArticleDAO.prototype = {
    constructor: ArticleDAO,
    save: function(obj){
        return new Promise(function (resolve, reject) {
            var instance = new Article(obj);
            instance.save(function (err) {
                resolve(err);
            })
        })
    }
};

module.exports = ArticleDAO;