const fs = require('fs');

global.config =
{
	//keep in mind that global chat, local chat and game itself have its own connections
	maxConnectionsPerAddress: 12,
	//use this for custom port
	port: 443,
	
	//use this for heroku
	//port: process.env.PORT,

	roomsRange: {min: 1, max: 8000}, //is there any ynfg with more rooms than y2?
	defaultSprite: {sheet: "000000000054", id: 0},
	defaultName: "Mado",

	https: false,
	keypath: "",
	certpath: "",
	clientPath: "public",
	gamesPath: "./public/play/games/",
	
	shouldSendPings: true,
	pingInterval_ms: 15000
}

if(global.config.https) {
	global.config.credentials = {
		key: fs.readFileSync(config.keypath),
		cert: fs.readFileSync(config.certpath),
	};
}

config.gamesList = fs.readdirSync(config.gamesPath);
