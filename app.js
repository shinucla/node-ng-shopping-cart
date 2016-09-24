//
// app.js
// @author Kevin Zhuang
// @version
// @since 09/17/2016
//

// MAIN ENTRY
//=======================================================================

var express           = require('express');
var app               = express();
var http              = require('http');
var ejs               = require('ejs');
var mongoose          = require('mongoose');
var route             = require('./route.js');

var bodyParser        = require('body-parser');
var cookieParser      = require('cookie-parser');
var session           = require('express-session');
var MongoSessionStore = require('connect-mongo')(session);

// ================================================================
// Global Variables
// ================================================================
Config                = require('./config.js');
Domain                = require('./db-domain.js'); // DAL


app.locals.pretty = true;
app.set('views', './public/ng/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); //js css img fonts...
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({ secret: 'my_super_secrete_word',
                  resave: false,
                  saveUninitialized: false,
                  store: new MongoSessionStore({ url: Config.db.url      //mongooseConnection: mongoose.connection }),
                                               }),
                  cookie: { maxAge: 180 * 60 * 1000 }
                }));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});


route.on(app);

http.createServer(app).listen(Config.web.port);  // $sudo PORT=8080 node app.js

mongoose.connect(Config.db.url,
                 { server: { keepAlive: 1,
                             reconnectTries: Number.MAX_VALUE,
                             socketOptions: { connectTimeoutMS: Config.db.timeout },
                             poolSize: Config.db.poolSize },
                   replset: { keepAlive: 1,
                              socketOptions: { connectTimeoutMS: Config.db.timeout },
                              poolSize: Config.db.poolSize }
                 },
                 function(err) {
                   if (err) process.exit(1);
                 });

mongoose.connection.on('connected', function () { // When successfully connected
  console.log('db connected');
});

mongoose.connection.on('disconnected', function () { // When the connection is disconnected
  console.log('db disconnected');
});

mongoose.connection.on('error',function (err) { // If the connection throws an error
  console.log('db error: ' + err);
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('close mongo connection');
    process.exit(0);
  });
});
