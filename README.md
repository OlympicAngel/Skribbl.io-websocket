# Skribbl.io websocket
 a simple node.js based tool that allow you to detect when it your turn to play in skribbl.io and adds an overlay in live (using browser with local host address) that will hide your screen. (prevent stream-snipe)

## how to use:
* simply run the exe or run via command:
```node.exe index.js```
* Then you will need a browser extansion that will allow you to inject js to skribbl.io
that code will detect when it your turn and sends that using websocket to the localhost server.
I will recommand "Tampermonkey" extasion,, install it and add new userscript:
```javascript
// ==UserScript==
// @name         skribble hider
// @version      1.0
// @description  tells the localhost at 6942 when its yout turn
// @author       OlympicAngel
// @match        https://skribbl.io/
// @grant        none
// ==/UserScript==

(function() {
    var port = "6942", blocker = false;
    var socket = new WebSocket('ws://localhost:' + port,"site");
    function startWebsocket() {
        socket.onclose = function(){
            socket = null
            setTimeout(startWebsocket, 1000)
        }
    }
    startWebsocket();

    var element = $("#overlay div.content div.wordContainer")[0];
    var element2 = $("#overlay div.content div.text")[0];

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(hider);
    observer.observe(element, {
  	  childList: true
    });
    var observer2 = new MutationObserver(shower);
    observer2.observe(element2, {
	  childList: true
    });

    function hider() {blocker = true; socket.send("0")}
    function shower() {
        if(blocker)
            blocker = false
        else
            socket.send("1")
    }
})();
```
Great! now all you need to do is to setup your OBS sence:
* Add new Browser Obj, in the url set it to:```http://localhost:6942/```,
I recommand in using ```Width:1600``` & ```Height:1300```,
and position it so it covers the painting area from the scribble website within obs layout.

### And... you good to go!

Feel free to add staff and/or fix dection script if skribbl changes its behavior..
