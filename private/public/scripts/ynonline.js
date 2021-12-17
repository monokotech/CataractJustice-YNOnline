let port = 443;
let WSAddress = "ws://" + window.location.hostname + ":" + port;
const urlParams = new URLSearchParams(window.location.search);
let YNOnline = {Network:{}};
let gameName = "";
if(urlParams.get("game"))
	gameName = urlParams.get("game");
else {
	gameName = window.location.pathname.replaceAll('/', '');
	Module.arguments.push("--game");
	Module.arguments.push(gameName);
	Module.EASYRPG_GAME = gameName;
}
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