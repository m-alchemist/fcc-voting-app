var express=require('express');

var path=require('path');
const LoginWithTwitter = require('login-with-twitter')

const tw = new LoginWithTwitter({
  consumerKey: 'unjlXpB0w32UNwQW7XRA43cW3',
  consumerSecret: 'OjCqm9GSl83hMzlJLuVBtW5YIDFwpucXe1xgApaSz73pdNPZGz',
  callbackUrl: 'https://malchemist-voting-app.herokuapp.com/twitter/callback'
})
var app=module.exports=express();

var port = process.env.PORT || 3000;

app.get('/twitter', function (req, res) {

})
app.get('/twitter/callback', function (req, res) {
res.send('hello worlds');
})
app.use(express.static(__dirname +'/public'));
// app.use(express.static(path.join(__dirname, 'style')));

app.listen(port,function(){
  console.log('listening on port '+port);
});
