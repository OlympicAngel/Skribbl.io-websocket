const WebSocketServer = require('websocket').server;
const fs = require('fs');
const port = 6942;
var http = require('http');
var skribleSiteBS, obsWS;

var server = http.createServer(function (request, response) {
  fs.readFile("./serverFiles/script.html", 'utf8', function (err, data) {
    if (err) {
      response.write(JSON.stringify(err));
      response.end();
      return console.log(err);
    }
    var body = data.replace("{1}", port);
    response.write(body, 'utf8');
    response.end();
  });
});
server.listen(port, function () {
  console.log((new Date()) + ' Server is listening on port ' + port);
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(request.origin + ' rejected.');
    return;
  }
  const reqProtocol = request.requestedProtocols[0];
  var connection = request.accept(reqProtocol, request.origin);

  if (reqProtocol == "site") {
    skribleSiteBS = connection;
    connection.on('message', function (message) {
      obsWS.send(message.utf8Data)
    });

  } else {
    obsWS = connection;
    connection.on('message', function (message) {
      skribleSiteBS.send(message.utf8Data)
    });
  }
});


function hasJsonStructure(str) {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return (type === '[object Object]' || type === '[object Array]') ? result : false;
  } catch (err) {
    return false;
  }
}