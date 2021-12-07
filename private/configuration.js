const fs = require('fs');

global.config =
{
	//keep in mind that global chat, local chat and game itself have its own connections
	maxConnectionsPerAddress: 12,

	port: 443,
	roomsRange: {min: 1, max: 500},
	defaultSprite: {sheet: "000000000054", id: 0},
	defaultName: "Mado",

	https: false,
	keypath: "",
	certpath: "",
	clientPath: "public",

	shouldSendPings: true,
	pingInterval_ms: 15000
}

if(global.config.https) {
	global.config.credentials = {
		key: fs.readFileSync(keypath),
		cert: fs.readFileSync(certpath),
	};
}