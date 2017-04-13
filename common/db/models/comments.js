/*
 *
 * 文章长短评论
 * 长 1
 * 短 0
 *
 */

var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise');

var CommentsSchema = new Schema({
    aid: String,
    comments: Array,
    type: Number,
    dtime: String,
    dmonth: String,
    dyear: String
});

var Comments = mongodb.mongoose.model('Comments', CommentsSchema);

var CommentsDAO = function () {
};

CommentsDAO.prototype = {
    constructor: CommentsDAO,
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            var instance = new Comments(obj);
            instance.save(function (err) {
                if (err) return reject(err);
                resolve();
            })
        })
    },
    delete: function (query) {
        return new Promise(function (resolve, reject) {
            Comments.remove(query, function (err, data) {
                if (err) return reject(err);
                resolve(data);
            })
        })
    },
    search: function (query) {
        return new Promise(function (resolve, reject) {
            Comments.find(query, function (err, data) {
                if (err) return reject(err);
                var result = [];
                console.log("data", data);
                console.log("id", query);
                if (data.length) {
                    for (let i = 0; i < data.length; i++) {
                        var d = {
                            aid: data[i].aid,
                            comments: data[i].comments,
                            type: data[i].type,
                            dtime: data[i].dtime,
                            dmonth: data[i].dmonth,
                            dyear: data[i].year
                        };
                        result.push(d)
                    }
                }
                resolve(result);
            })
        })
    }
};

module.exports = CommentsDAO;