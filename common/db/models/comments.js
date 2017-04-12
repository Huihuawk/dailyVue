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
    comments: String,
    type: Number
});

var Comments = mongodb.mongoose.model('Comments', CommentsSchema);

var CommentsDAO = function () {};

CommentsDAO.prototype = {
    constructor: CommentsDAO,
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            var instance = new Comments(obj);
            instance.save(function (err) {
                if(!err) return reject(err);
                resolve();
            })
        })
    }
};

module.exports = CommentsDAO;