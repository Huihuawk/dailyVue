module.exports = {
    auth: '',
    mongo: {
        name: 'daily',
        host: '127.0.0.1',
        port: 27017,
        username: '',
        password: '',
        url: function () {
            return ['mongodb://',
                this.username, ':',
                this.password, '@',
                this.host, ':', this.port, '/', this.name].join('');
        }
    },
    mongoOptions: {
        server: {
            poolSize: 1,
            socketOptions: {
                auto_reconnect: true
            }
        }
    },
    log: {
        isOpenningHTTP: true,
        isOpenningNode: true
    },
    spider: {
        start: '20170410',
        end: '20170408',
        interval: 20,
        errHistory: 1,
        errArticle: 2,
        errComments: 3,
        errDaily: 4
    }
};