/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var ejs = require('ejs');

/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var forgotController = require('./controllers/forgot');
var resetController = require('./controllers/reset');

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
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
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

app.get('/', homeController.index);
app.get('/t/:tournamentId', homeController.index);
app.get('/t/:tournamentId/s/:stageId', homeController.index);
app.get('/t/:tournamentId/m/:matchId', homeController.index);
app.get('/generator/new', homeController.index);
app.get('/generator/:tournamentId', homeController.index);
app.get('/generator/:tournamentId/participants', homeController.index);
app.get('/generator/:tournamentId/stages', homeController.index);
app.get('/generator/:tournamentId/stages/new', homeController.index);
app.get('/generator/:tournamentId/stages/:stageId', homeController.index);
app.get('/generator/:tournamentId/stages/:stageId/rounds', homeController.index);
app.get('/generator/:tournamentId/stages/:stageId/preview', homeController.index);
app.get('/login', homeController.index);
app.get('/logout', homeController.index);
app.get('/forgot', homeController.index);
app.get('/reset/:token', homeController.index);
app.get('/signup', homeController.index);
//app.get('/account', passportConf.isAuthenticated, userController.getAccount);

app.post('/login', userController.postLogin);
app.post('/forgot', forgotController.postForgot);
app.post('/reset/:token', resetController.postReset);
app.post('/signup', userController.postSignup);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});

module.exports = app;