var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise');

var HistoryScheme = new Schema({
    id: String,
    title: String,
    image: String,
    dtime: String
});

var HistoryDAO = function () {};

var History = mongodb.mongoose.model('History', HistoryScheme);

HistoryDAO.prototype = {
    constructor: HistoryDAO,
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            var instance = new History(obj);
            instance.save(function (err) {
                resolve && resolve(err);
            })
        })
    },
    list: function () {
        return new Promise(function (resolve, reject) {
            History.find(function (err, d) {
                resolve && resolve(d);
            })
        })
    }
};

module.exports = HistoryDAO;