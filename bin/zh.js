#!/usr/bin/env node
/**
 * Module dependencies.
 */
var debug = require('debug')('my-application');
var app = require('../app');

/**
 * Get port from environment and store in Express.
 */
app.set('port', process.env.PORT || 5502);

/**
 * Listen on provided port, on all network interfaces.
 */
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
