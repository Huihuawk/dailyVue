import 'whatwg-fetch'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
// 引入组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

const $ = document.querySelector.bind(document);
const YearData = $('#dyear').innerHTML;

//render table tr
const renderMonthMaxArticles = (topData, container) => {
    let dom = '',
        arts = topData.articles;
    for (let i = 0, len = arts.length; i < len; i++) {
        dom += `<tr><th scope="row">${arts[i].dtime.substr(4,2)}</th><td>${topData.counts[i]}</td><td><a href="/#/detail?aid=${arts[i].id}">${arts[i].title}</a></td><td>${arts[i].dtime}</td></tr>`;
    }
    container.innerHTML = dom;
};

//获取文章数据
const fetchArticles = aids => {
    return fetch(`/api-statis/articles/${aids}`)
        .then(function (response) {
            return response.json()
        })
        .catch(function (err) {
            console.log("fa",err);
            return [];
        })
};

const renderCharts = (json) => {
    const data = json.data;
    const topArticles = json.articles;
    const tenK = json.sTenK;
    const twentyK = json.sTwentyK;
    const oneK = json.cOneK;

    // 基于准备好的dom，初始化echarts实例
    const chartSum = echarts.init($('#sum-all'));
    const chartTopStar = echarts.init($('#top-star'));
    const chartTopCmt = echarts.init($('#top-cmt'));

    // 每月总数
    let sumStarData = [];
    let sumCmtData = [];

    // 全年总数
    let sumStarCount = 0;
    let sumCmtCount = 0;

    // 每月最高
    let topMonthStar = {
        counts: [],
        aids: [],
        articles: []
    };
    let topMonthCmt = {
        counts: [],
        aids: [],
        articles: []
    };

    //top star
    for (let s of data.star) {
        sumStarCount += parseInt(s.sum);
        sumStarData.push(s.sum);
        topMonthStar.counts.push(s.count[0]);
        topMonthStar.aids.push(s.aids[0]);
    }

    //top cmt
    for (let c of data.cmt) {
        sumCmtCount += parseInt(c.sum);
        sumCmtData.push(c.sum);
        topMonthCmt.counts.push(c.count[0]);
        topMonthCmt.aids.push(c.aids[0]);
    }

    let maxStar = {
        idx: 0,
        count: 0,
        article: {}
    };

    //max star
    for (let i = 0, len = topMonthStar.counts.length; i < len; i++) {
        if (topMonthStar.counts[i] > maxStar.count) {
            maxStar.idx = i;
            maxStar.count = topMonthStar.counts[i];
        }
    }

    let maxComment = {
        idx: 0,
        count: 0,
        article: {}
    };

    //max cmt
    for (let i = 0, len = topMonthCmt.counts.length; i < len; i++) {
        if (topMonthCmt.counts[i] > maxComment.count) {
            maxComment.idx = i;
            maxComment.count = topMonthCmt.counts[i];
        }
    }

    // 渲染总数chart
    chartSum.setOption({
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            feature: {
                dataView: {show: true},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        legend: {
            data: ['点赞总数', '评论总数'],
            x: 'center'
        },
        xAxis: [
            {
                type: 'category',
                axisLine: {
                    show: false
                },
                data: data.month
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '点赞总数',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '评论总数',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '点赞总数',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#48BE8A'
                    }
                },
                data: sumStarData
            },
            {
                name: '评论总数',
                type: 'line',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: '#62A8EA'
                    },
                },
                data: sumCmtData
            }
        ]
    });

    $('#sum-star').innerHTML = sumStarCount;
    $('#sum-cmt').innerHTML = sumCmtCount;

    // render高人气文章

    // 点赞大于10K
    let tenKLinks = '';
    for (let t of tenK) {
        tenKLinks += `<tr><td>${t.count}</td><td><a href="/#/detail?aid=${t.aid}">${topArticles[t.aid].title}</a></td><td><a href="/#/date?dtime=${topArticles[t.aid].dtime}">${topArticles[t.aid].dtime}</a></td></tr>`
    }

    $('#ten-star').innerHTML = `[${tenK.length}]`;
    $('#ten-star-body').innerHTML = tenKLinks;

    // 点赞大于20K
    let twentyKLinks = '';
    for (let t of twentyK) {
        twentyKLinks += `<tr><td>${t.count}</td><td><a href="/#/detail?aid=${t.aid}">${topArticles[t.aid].title}</a></td><td><a href="/#/date?dtime=${topArticles[t.aid].dtime}">${topArticles[t.aid].dtime}</a></td></tr>`
    }

    $('#twe-star').innerHTML = `[${twentyK.length}]`;
    $('#twe-star-body').innerHTML = twentyKLinks;

    // 评论大于1K
    let oneKLinks = '';
    for (let t of oneK) {
        oneKLinks += `<tr><td>${t.count}</td><td><a href="/#/detail?aid=${t.aid}">${topArticles[t.aid].title}</a></td><td><a href="/#/date?dtime=${topArticles[t.aid].dtime}">${topArticles[t.aid].dtime}</a></td></tr>`
    }

    $('#one-cmt').innerHTML = `[${oneK.length}]`;
    $('#one-cmt-body').innerHTML = oneKLinks;

    // 获取每月最多点赞评论文章标题
    fetchArticles(topMonthStar.aids).then(function (d) {
        for (let j = 0, length = topMonthStar.aids.length; j < length; j++) {
            for (let i = 0, len = d.length; i < len; i++) {
                if (topMonthStar.aids[j] === d[i].id) {
                    topMonthStar.articles.push(d[i])
                }
            }
        }
        // 全年最高点赞文章
        maxStar.article = topMonthStar.articles[maxStar.idx];
        $('#max-year-star').innerHTML = `<a href="/#/detail?aid=${maxStar.article.id}"><i class="txt-s">[${maxStar.count}]</i>${maxStar.article.title}</a> - <a href="/#/date?dtime=${maxStar.article.dtime}">[${maxStar.article.dtime}]</a>`;

        renderMonthMaxArticles(topMonthStar, $('#star-articles'));
    });

    fetchArticles(topMonthCmt.aids).then(function (d) {
        for (let j = 0, length = topMonthCmt.aids.length; j < length; j++) {
            for (let i = 0, len = d.length; i < len; i++) {
                if (topMonthCmt.aids[j] == d[i].id) {
                    topMonthCmt.articles.push(d[i])
                }
            }
        }
        // 全年最高评论文章
        maxComment.article = topMonthCmt.articles[maxComment.idx];
        $('#max-year-cmt').innerHTML = `<a href="/#/detail?aid=${maxComment.article.id}"><i class="txt-c">[${maxComment.count}]</i>${maxComment.article.title}</a> - <a href="/#/date?dtime=${maxComment.article.dtime}">[${maxComment.article.dtime}]</a>`

        renderMonthMaxArticles(topMonthCmt, $('#cmt-articles'))
    });

    // render TopStar
    chartTopStar.setOption({
        toolbox: {
            feature: {
                dataView: {show: true},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['最多点赞'],
            x: 'center'
        },
        xAxis: [
            {
                type: 'category',
                axisLine: {
                    show: false
                },
                data: data.month
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单篇最多点赞',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '最多点赞',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#62A8EA'
                    },
                },
                data: topMonthStar.counts
            }
        ]
    });

    chartTopCmt.setOption({
        toolbox: {
            feature: {
                dataView: {show: true},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['最多评论'],
            x: 'center'
        },
        xAxis: [
            {
                type: 'category',
                axisLine: {
                    show: false
                },
                data: data.month
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单篇最多评论',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '最多评论',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#62A8EA'
                    },
                },
                data: topMonthCmt.counts
            }
        ]
    });
};

fetch(`/api-statis/year/${YearData}`)
    .then(function (response) {
        return response.json()
    })
    .then(function (json) {
        if (json.data) {
            renderCharts(json);
        } else {
            $('.year-cuts').innerHTML = '<h1>还没统计</h1>'
        }
    });