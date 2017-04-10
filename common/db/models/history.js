var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise');

var HistoryScheme = new Schema({
    id: String,
    title: String,
    image: String,
    dtime: String,
    dmonth: String,
    dyear: String
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
    },
    count: function (query) {
        return new Promise(function (resolve, reject) {
            History.count(query, function (err, d) {
                resolve && resolve(d);
            })
        })
    },
    so: function (query) {
        return new Promise(function (resolve, reject) {
            History.find(query, function (err, d) {
                var data = [];
                for(var i = 0; i< d.length; i++){
                    var re = {
                        id : d[i].id,
                        title : d[i].title,
                        image: d[i].image,
                        theme: d[i].theme
                    }
                    data.push(re);
                }
                resolve && resolve(data);
            })
        })
    }
};

module.exports = HistoryDAO;