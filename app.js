
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var sockjs = require('sockjs');
var fs = require('fs');
var connections = [];

var chat = sockjs.createServer();

chat.on('connection', function(conn) {
  connections.push(conn);
  var number = connections.length;
  broadcast('User ' + number + ' has joined.');

  conn.on('data', function(message){
    broadcast(message);
  });

  conn.on('close', function(){
    broadcast("User " + number + " has left.");
  });

});

function broadcast(message){
  var DELIMITER = ':::::'
  if(message.indexOf(DELIMITER)!=-1){
    var details = message.split(DELIMITER);
    message = details[0]+' says: '+ details[1];
  }
  for(var user=0; user<connections.length; user++) {
    connections[user].write(message);
  }
}
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/upload', function (req, res) {
  console.log('Upload Post called with request file: '+req.files);
  setTimeout(
    function(){
      res.setHeader('Content-Type', 'text/html');
      if(req.files.length==0 || req.files.file.size == 0){
        res.send(304, {msg: 'No file uploaded'});
      }
      else{
        var file = req.files.file;
        var target_path = __dirname+'/public/uploaded/' + file.path.substring(5);
        var url_path = '/uploaded/' + file.path.substring(5);

        fs.readFile(file.path, function(err, data){
          if(err)
            res.send(304, {msg: 'Unable to access uploaded file: '+err});
          fs.writeFile(target_path, data, function(err){
            if(err)
              res.send(304, {msg: 'Unable to write uploaded file: '+err});

            res.send(200, {msg: url_path});
          });
        });


        // fs.unlink(file.path, function(error){
        //   if(error)
        //     throw error;
        //   else
        //     console.log('File present at: '+file.path);
        //     res.send(200, {msg: file.name + '"<b> uploaded to the server at ' + new Date().toString() });
        // });

      }
    }, 5000);
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

chat.installHandlers(server, {prefix:'/chat'});
