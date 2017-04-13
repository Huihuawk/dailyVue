/*
 *
 * 临时记录出错的ID
 *
 */
var mongodb = require('../connect');
var Schema = mongodb.mongoose.Schema;
var Promise = require('es6-promise');

var TempSchema = new Schema({
    aid: String,
    dtime: String
});

var Temp = mongodb.mongoose.model('Temp', TempSchema);

var TempDAO = function () {

};

TempDAO.prototype = {
    constructor: TempDAO,
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            var instance = new Temp(obj);
            instance.save(function (err) {
                if (err) return reject(err);
                resolve();
            })
        })
    },
    delete: function (query) {
        return new Promise(function (resolve, reject) {
            Temp.remove(query, function (err, data) {
                if(err) return reject(err);
                resolve(data);
            })
        })
    },
    search: function (query) {
        return new Promise(function (resolve, reject) {
            Temp.find(query, function (err, data) {
                var result = [];
                if(data.length){
                    for(var i = 0; i < data.length; i++){
                        var d = {
                            aid: data[i].aid,
                            dtime: data[i].dtime
                        }
                        result.push(d);
                    }
                }
                resolve(result);
            })
        })
    }
}

module.exports = TempDAO;