let port = 443;
let WSAddress = "ws://" + window.location.hostname + ":" + port;
const urlParams = new URLSearchParams(window.location.search);
let gameName = "";//urlParams.get("game");
let YNOnline = {Network:{}};

//comment this to stop pings
////////
setInterval(
	function() {
		if(WS.sockets[0])
			if(WS.sockets[0].readyState == WebSocket.OPEN)
				WS.sockets[0].send(".");
	},
	15000
);
////////