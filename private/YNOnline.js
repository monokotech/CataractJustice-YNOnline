require('./configuration');
const ChatServer = require('./Network/ChatServer');
const GameServer = require('./Network/GameServer');
const ConnectionManager = require('./Network/ConnectionManager');
const http = require('http');
const https = require('https');
const express = require('express');
const ServerListing = require('./Network/ServerListing');

global.YNOnline = 
{
	Network: {
		logWarning: function(args) {console.log(args);},
		logEWarning: function(args) {console.log(args);},
		gameServer: {}
	}
};

let expressapp = express();
expressapp.use(express.static(config.clientPath));
if(config.https)
	YNOnline.Network.server = https.createServer(config.credentials, expressapp).listen(config.port);
else
	YNOnline.Network.server = http.createServer(expressapp).listen(config.port);

YNOnline.Network.connectionManager = new ConnectionManager();

for(let gameName of config.gamesList) {
	YNOnline.Network.gameServer[gameName] = new GameServer(gameName);
	YNOnline.Network.connectionManager.AddService(gameName + "game", YNOnline.Network.gameServer[gameName]);
	YNOnline.Network.connectionManager.AddService(gameName + "chat", new ChatServer(gameName));
}

YNOnline.Network.connectionManager.AddService("listing", new ServerListing());
