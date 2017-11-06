var watch = require('node-watch');
var http = require('http');
var build = require('./build.js');

var serve = require('ecstatic')({
  root: process.cwd(),
  showDir: true,
  autoIndex: true,
});


http.createServer(serve).listen(8080);
console.log('Listening on :8080.  Watching...');

build();

['themes','templates','themeinfo.json','scss'].forEach(function(s){
  watch(s,build);
})
