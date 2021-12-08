require('./configuration');
const ChatServer = require('./Network/ChatServer');
const GameServer = require('./Network/GameServer');
const ConnectionManager = require('./Network/ConnectionManager');
const http = require('http');
const https = require('https');
const express = require('express');
/*
TO-DO:
	-add chat rooms instead of creating a bunch of chats on startup
	-support for several games
*/


global.YNOnline = 
{
	Network: {
		logWarning: function(args) {console.log(args);},
		logEWarning: function(args) {console.log(args);}
	}
};

let expressapp = express();
expressapp.use(express.static(config.clientPath));
if(config.https)
	YNOnline.Network.server = https.createServer(config.credentials, expressapp).listen(config.port);
else
	YNOnline.Network.server = http.createServer(expressapp).listen(config.port);

YNOnline.Network.chatServer = new ChatServer();
YNOnline.Network.gameServer = new GameServer();
YNOnline.Network.connectionManager = new ConnectionManager();
YNOnline.Network.connectionManager.AddService("game", YNOnline.Network.gameServer);
YNOnline.Network.connectionManager.AddService("chat", YNOnline.Network.chatServer);
