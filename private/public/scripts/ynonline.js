let port = 443;
let WSAddress = "wss://" + window.location.hostname + ":" + port;

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