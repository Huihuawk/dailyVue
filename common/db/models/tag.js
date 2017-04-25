/*
 *
 * tag model
 *
 */

var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise');

var TagSchema = new Schema({
    aid:  { type: String, index: true },
    tags: [String],
    dtime: String,
    dmonth: String
});

var Tag = mongodb.mongoose.model("Tag", TagSchema);

var TagDAO = function () {

};

TagDAO.prototype = {
    constructor: TagDAO,
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            var instance = new Tag(obj);
            instance.save(function (err) {
                if (err) return reject(err);
                resolve();
            })
        })
    },
    delete: function (query) {
        return new Promise(function (resolve, reject) {
            Tag.remove(query, function (err, data) {
                if (err) return reject(err);
                resolve();
            })
        })
    },
    search: function (query) {
        return new Promise(function (resolve, reject) {
            Tag.find(query, function (err, data) {
                if (err) return reject(err);
                var result = [];
                for (var i = 0; i < data.length; i++) {
                    var d = {
                        aid: data[i].id,
                        tags: data[i].tags,
                        dtime: data[i].dtime,
                        dmonth: data[i].dmonth
                    }
                    result.push(d);
                }
                resolve(result);
            })
        })
    }
};

module.exports = TagDAO;