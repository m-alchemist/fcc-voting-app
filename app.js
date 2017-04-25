var express=require('express');

var path=require('path');
const passport = require('passport');

const TwitterStrategy = require('passport-twitter');
  passport.use(new TwitterStrategy({
    consumerKey: 'unjlXpB0w32UNwQW7XRA43cW3',
    consumerSecret: 'OjCqm9GSl83hMzlJLuVBtW5YIDFwpucXe1xgApaSz73pdNPZGz',
    callbackURL: "https://malchemist-voting-app.herokuapp.com"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
var app=module.exports=express();

var port = process.env.PORT || 3000;

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
    $('loginName').innerHTML(req.profile.id);
  });
app.use(express.static(__dirname +'/public'));
// app.use(express.static(path.join(__dirname, 'style')));

app.listen(port,function(){
  console.log('listening on port '+port);
});
