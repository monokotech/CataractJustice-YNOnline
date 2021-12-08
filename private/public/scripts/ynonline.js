let port = 443;
let WSAddress = "ws://" + window.location.hostname + ":" + port;
const urlParams = new URLSearchParams(window.location.search);
let YNOnline = {Network:{}};

if(urlParams.get("game"))
	Module.EASYRPG_GAME = urlParams.get("game");
else
	Module.EASYRPG_GAME = window.location.pathname;

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