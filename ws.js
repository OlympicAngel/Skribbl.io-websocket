const WebSocketServer = require('websocket').server;
const fs = require('fs');
const port = 8080;
var http = require('http');
var clinetShowWS;

var server = http.createServer(function(request, response) {
    fs.readFile("./serverFiles/script.html", 'utf8', function (err,data) {
        if (err) {
            response.write(JSON.stringify(err));
            response.end();
          return console.log(err);
        }
        var connectScript;
        if(request.url.toLocaleLowerCase() == "/show")
        {
            connectScript = "show";
        }
        else
        {
            connectScript = "settings";
        }
        var body = data.replace("{0}",connectScript).replace("{1}",port)
        response.write(body,'utf8');
        response.end();
      });
});
server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    const reqProtocol = request.requestedProtocols[0];
    if(["show","settings"].indexOf(reqProtocol) == -1)
    {
        request.reject("not allowed!");
        console.log("rejected - not match protocole");
        return;
    }
    
    var connection = request.accept(reqProtocol, request.origin);
    console.log((new Date()) + ' Connection accepted - ' + reqProtocol);
    if(reqProtocol == "settings")
    {
        connection.on('message', function(message) {
            var msg = (message.utf8Data);
            var JSONed = hasJsonStructure(msg);
            if(!JSONed)
            {
                console.log("settings from clint error:" + msg);
                return;
            }

            //settings setter logic;


        });
    }
    else
    {
        //save for later send event..
        if(clinetShowWS)
        {
            clinetShowWS.drop();
            clinetShowWS = undefined;
        }
        clinetShowWS = connection;
    }

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});


function hasJsonStructure(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return (type === '[object Object]' || type === '[object Array]')?result:false;
    } catch (err) {
        return false;
    }
}

module.exports = {
     ShowOnWebClint(keys,isSend,sender)
    {
        if(!clinetShowWS)
        {
            console.log("connection not initialized");
            return;
        }
        
        var loopKeys;
        if(typeof keys == "string")
            loopKeys = [keys];
        else
            loopKeys = Object.assign(keys);
        
        for(var x = 0; x < loopKeys.length; x++)
        {
            const jsoned = {key: loopKeys[x],isFinal: isSend, sender: sender}
            clinetShowWS.send(JSON.stringify(jsoned));
        }
    }
  };