let port = 443;
let WSAddress = "ws://" + window.location.hostname + ":" + port;
let YNOnline = {Network:{}};

setInterval(
	function() {
		if(WS.sockets[0])
			if(WS.sockets[0].readyState == WebSocket.OPEN)
				WS.sockets[0].send(".");
	},
	15000
);