var Spider = require('../common/util/spider');
var TempDAO = require('../common/db/models/temp');
var DateCalc = require('../common/util/date');

var Temp = {
    // 爬虫错误列表
    list: function(req, res){
        var tempDAO = new TempDAO();
        tempDAO.list().then(function(list){
            var data = [];
            for(var i=0,length=list.length;i<length;i++){
                var err = {
                    aid: list[i].aid || 0,
                    dtime: list[i].dtime || 0
                }
                data.push(err)
            }
            res.render('spider-err.ejs', {'data': data});
        });
    },
    // fix错误 重新爬 dtime 数据
    clear: function(req, res){
        var dtime = req.params.dtime;
        var d = new DateCalc();
        if(dtime != d.now()){
            Spider.dayRefresh(dtime)
                .then(function(){
                    res.json(dtime + ' refresh over');
                })
        }else {
            res.json(dtime + ' refresh over');
        }
    }



}
module.exports = Temp;