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
    shareUrl: String,
    section: Object,
    sectoonId: String,
    sectionName: String,
    dtime: String,
    dmonth: String,
    dyear: String
});

var ArticleDAO = function () {

};

var Article = mongodb.mongoose.model('Article', ArticleSchema);

ArticleDAO.prototype = {
    constructor: ArticleDAO,
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            var instance = new Article(obj);
            instance.save(function (err) {
                if (err) return reject(err);
                resolve();
            })
        })
    },
    search: function (query) {
        return new Promise(function (resolve, reject) {
            Article.find(query, function (err, data) {
                if (err) return reject(err);
                var result = [];
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        var d = {
                            id: data[i].id,
                            title: data[i].title,
                            body: data[i].body,
                            image: data[i].image,
                            imageSource: data[i].imageSource,
                            shareUrl: data[i].shareUrl,
                            section: data[i].section,
                            sectionId: data[i].sectionId,
                            sectionName: data[i].sectionName,
                            dtime: data[i].dtime,
                            dmonth: data[i].dmonth,
                            dyear: data[i].dyear
                        };
                        result.push(d);
                    }
                }
                resolve(result);
            })
        })
    },
    delete: function (query) {
        return new Promise(function (resolve, reject) {
            Article.remove(query, function (err, data) {
                if (err) return reject(err);
                resolve(data);
            })
        })
    }
};

module.exports = ArticleDAO;