var cheerio = require('cheerio');
var ArticleDAO = require('../db/models/article');
var TagDAO = require('../db/models/tag');
var jieba = require('nodejieba');

var articleDAO = new ArticleDAO(),
    tagDAO = new TagDAO();

jieba.load({
    stopWordDict: './dict/stop_words.utf8',
});

var Tag = {
    saveTags: function (aid) {
        return tagDAO.search({aid: aid})
            .then(function (result) {
                if(result.length){
                    return Promise.reject('has tag');
                }else {
                    return Promise.resolve(aid);
                }
            })
            .then(function (aid) {
                return articleDAO.search(aid);
            })
            .then(function (result) {
                var $ = cheerio.load(result.body, {decodeEntities: false});
                var wordsArr = jieba.extract($.root().text(), 10),
                    tagArr = [];
                for (var i = 0, len = wordsArr.length; i < len; i++){
                    tagArr.push(wordsArr[i]['word'])
                }
                tagDAO.save({
                    aid: aid,
                    tags: tagArr,
                    dtime: result.dtime,
                    dmonth: result.dmonth
                });
                return Promise.resolve({aid: aid});
            })
            .catch(function (err) {
                console.log("err", err);
            })
    },
    searchTags: function (query) {
        return tagDAO.search(query)
            .then(function (result) {
                console.log(result);
                return Promise.resolve(result);
            })
            .catch(function () {
                console.log("----------------");
                return Promise.reject([]);
            })
    }
};

module.exports = Tag;