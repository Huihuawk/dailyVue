import echarts from 'echarts';

// 基于准备好的dom，初始化echarts实例
const $ = document.querySelector.bind(document);
// 绘制图表

const renderCharts = () => {
    const shutCuts = echarts.init($('#shut-cuts'));
    shutCuts.setOption({
        title: {
            text: '年数据分析'
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
            axisLine:{
                show: false
            },
            data: ['2013','2014','2015','2016','2017']
        },
        yAxis: {
            axisLine:{
                show: false
            },
            type: 'value'
        },
        series: [
            {
                name:'点赞总数',
                type:'line',
                itemStyle: {
                    normal: {
                        color: '#48BE8A'
                    },
                },
                stack: '总量',
                data:[9801, 2561850, 11891035, 8144051, 870849]
            },
            {
                name:'评论总数',
                type:'line',
                itemStyle: {
                    normal: {
                        color: '#62A8EA'
                    },
                },
                stack: '总量',
                data:[117469, 557770, 892222, 600888, 70507]
            }
        ]
    });
}

renderCharts();