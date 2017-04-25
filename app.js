var express=require('express');

var path=require('path');
var app=module.exports=express();

var port = process.env.PORT || 3000;


app.use(express.static(__dirname +'/public'));
// app.use(express.static(path.join(__dirname, 'style')));

app.listen(port,function(){
  console.log('listening on port '+port);
});
