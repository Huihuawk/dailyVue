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
        gogo: false,
        openTask: false,
        start: '20170531',
        end: '20151231',
        interval: 5,
    },
    fe: {
        developing: true
    }
};