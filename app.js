/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var ejs = require('ejs');

/**
 * Create Express server.
 */

var app = express();

/**
 * Express configuration.
 */

var hour = 3600000;
var day = (hour * 24);
var week = (day * 7);
var month = (day * 30);

var staticPath = "";
if (app.get('env') == 'production') {
    staticPath = path.join(__dirname, 'dist');
} else {
    staticPath = path.join(__dirname, 'src');
}

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.set('views', staticPath);
app.engine('html', ejs.renderFile);
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(staticPath));
app.use(app.router);

app.use(function(req, res) {
  res.status(404);
  res.render('404');
});
app.use(express.errorHandler());

/**
 * Application routes.
 */

app.get('*', function(req, res) {
    res.render('index.html');
});

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});

module.exports = app;