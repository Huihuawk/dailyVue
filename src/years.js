import echarts from 'echarts';

const $ = document.querySelector.bind(document);

const renderCharts = () => {
    // 基于准备好的dom，初始化echarts实例
    const shutCuts = echarts.init($('#shut-cuts'));
    const y2013 = echarts.init($('#y2013'));
    const y2014 = echarts.init($('#y2014'));
    const y2015 = echarts.init($('#y2015'));
    const y2016 = echarts.init($('#y2016'));
    const y2017 = echarts.init($('#y2017'));
// 绘制图表
    shutCuts.setOption({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['点赞总数', '评论总数']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                dataView:{show:true},
                magicType: {show: true, type: ['line', 'bar','stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false
            },
            data: ['2013', '2014', '2015', '2016', '2017']
        },
        yAxis: {
            axisLine: {
                show: false
            },
            type: 'value'
        },
        series: [
            {
                name: '点赞总数',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#48BE8A'
                    },
                },
                stack: '总量',
                data: [9801, 2561850, 11891035, 8144051, 870849]
            },
            {
                name: '评论总数',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#62A8EA'
                    },
                },
                stack: '总量',
                data: [117469, 557770, 892222, 600888, 70507]
            }
        ]
    });

    y2013.setOption({
        title: {
            text: '92.3%',
            x: 'center',
            y: 'center',
            textStyle: {
                color: '#666',
                fontSize: '24'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ['#57C7D4', '#D5D8D9'],
        series: [
            {
                name: '2013年相关数据',
                type: 'pie',
                radius: ['70%', '85%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: 9801, name: '点赞数'},
                    {value: 117469, name: '评论数'}
                ]
            }
        ]
    })

    y2014.setOption({
        title: {
            text: '82.12%',
            x: 'center',
            y: 'center',
            textStyle: {
                color: '#666',
                fontSize: '24'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ['#62A8EA', '#D5D8D9'],
        series: [
            {
                name: '2014年相关数据',
                type: 'pie',
                radius: ['70%', '85%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: 2561850, name: '点赞数'},
                    {value: 557770, name: '评论数'}
                ]
            }
        ]
    })

    y2015.setOption({
        title: {
            text: '93.02%',
            x: 'center',
            y: 'center',
            textStyle: {
                color: '#666',
                fontSize: '24'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ['#926DDE', '#D5D8D9'],
        series: [
            {
                name: '2015年相关数据',
                type: 'pie',
                radius: ['70%', '85%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: 11891035, name: '点赞数'},
                    {value: 892222, name: '评论数'}
                ]
            }
        ]
    })

    y2016.setOption({
        title: {
            text: '93.13%',
            x: 'center',
            y: 'center',
            textStyle: {
                color: '#666',
                fontSize: '24'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ['#F96868', '#D5D8D9'],
        series: [
            {
                name: '2016年相关数据',
                type: 'pie',
                radius: ['70%', '85%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: 8144051, name: '点赞数'},
                    {value: 600888, name: '评论数'}
                ]
            }
        ]
    })

    y2017.setOption({
        title: {
            text: '92.51%',
            x: 'center',
            y: 'center',
            textStyle: {
                color: '#666',
                fontSize: '24'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ['#F2A654', '#D5D8D9'],
        series: [
            {
                name: '2017年相关数据',
                type: 'pie',
                radius: ['70%', '85%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: 870849, name: '点赞数'},
                    {value: 70507, name: '评论数'}
                ]
            }
        ]
    })
};

renderCharts();