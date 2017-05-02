var echarts = require('echarts');

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init($('#shut-cuts'));
// 绘制图表
myChart.setOption({title: {
    text: '折线图堆叠'
},
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['点赞总数','评论总数']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2013','2014','2015','2016','2017']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'点赞总数',
            type:'line',
            stack: '总量',
            data:[9801, 2561850, 11891035, 8144051, 870849]
        },
        {
            name:'评论总数',
            type:'line',
            stack: '总量',
            data:[117469, 557770, 892222, 600888, 70507]
        }
    ]
});