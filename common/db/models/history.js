var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise');

var HistoryScheme = new Schema({
    id:  { type: String, index: true },
    title: String,
    image: String,
    type: String,
    dtime: { type: String, index: true },
    dmonth: String,
    dyear: String
});

var HistoryDAO = function () {
};

var History = mongodb.mongoose.model('History', HistoryScheme);

HistoryDAO.prototype = {
    constructor: HistoryDAO,
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            var instance = new History(obj);
            instance.save(function (err) {
                if (err) return reject(err);
                resolve();
            })
        })
    },
    delete: function (query) {
        return new Promise(function (resolve, reject) {
            History.remove(query, function (err, data) {
                if (err) return reject(err);
                resolve(data);
            })
        })
    },
    list: function () {
        return new Promise(function (resolve, reject) {
            History.find(function (err, d) {
                resolve(d);
            })
        })
    },
    count: function (query) {
        return new Promise(function (resolve, reject) {
            History.count(query, function (err, d) {
                resolve(d);
            })
        })
    },
    search: function (query) {
        return new Promise(function (resolve, reject) {
            History.find(query, function (err, d) {
                var data = [];
                if (d.length) {
                    for (var i = 0; i < d.length; i++) {
                        var re = {
                            id: d[i].id,
                            title: d[i].title,
                            image: d[i].image,
                            dtime: d[i].dtime
                        };
                        data.push(re);
                    }
                }
                resolve(data);
            })
        })
    }
};

module.exports = HistoryDAO;