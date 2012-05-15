var pin = require('./linchpin')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , now = require('now')
  , LocalStrategy = require('passport-local').Strategy;

// Need to save contacts and users in couch
User = require('./user');
Contact = require('./contact');

var app = module.exports = express.createServer()

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/../views')
  app.set('view engine', 'jade')
  app.set('port', 9090)
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.cookieParser())
  app.use(express.session({secret: 'GuDaRsSnOegiP8679Pige0'}))
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router)
  app.use(express.static(__dirname + '/../public'))
})

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('test', function(){
  app.set('port', 3001)
})

app.configure('production', function(){
  app.set('port', 80)
  app.use(express.errorHandler());
})

app.listen(app.settings.port, function(){
  console.log("Server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// Routes
app.get('/', function(req, res) { res.render('index', {title: 'Guestbook'}); })

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.flash('error'), title: 'login' });
});

app.get('/guestbook',ensureAuthenticated,
  function(req, res){
   res.render('guestbook', {title: ' Welcome ' + req.user.username, username: req.user.username,  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/guestbook');
  });

 //this needs to be encrypted from couch data store
var users = [
    { id: 1, username: 'bob', password: 'password', email: 'bob@bob.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password != password) { return done(null, false); }
        return done(null, user);
      })
    });
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

everyone = now.initialize(app)
everyone.now.showContact= function(contact){
  everyone.now.newContact(contact);
};
