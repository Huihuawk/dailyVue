/*
*
* 文章点赞、评论
*
*/
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise');

var CmtCountSchema = new Schema({
    aid: String,
    longComments: Number,
    shortComments: Number,
    popularity: Number,
    comments: Number,
    dtime: String,
    dmonth: String,
    dyear: String
});

var CmtCountDAO = function () {};

var CmtCount = mongodb.mongoose.model('CmtCount', CmtCountSchema);

CmtCountDAO.prototype = {
    constructor: CmtCountDAO,
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            var instance = new CmtCount(obj);
            instance.save(function (err) {
                if(!err) return reject(err);
                resolve();
            })
        })
    }
};

module.exports = CmtCountDAO;