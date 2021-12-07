require('./configuration');
const Chat = require('./Network/Chat');
const GameServer = require('./Network/GameServer');
const ConnectionManager = require('./Network/ConnectionManager');
const http = require('http');
const https = require('https');
const express = require('express');
/*
TO-DO:
	**fix possible exploit when in json sent by client some of the value-type fields can be replaced with objects
	-rewrite every log/warning/error message to the following format { tags:[string...], text: "descrition", extra:{*} }
		~add tags list
	-add sprite/sound/other name validators
	-add / commands for sprite change
	~revise naming style

Wishlist (in priority order): 
	-add switch/event sync
	-add switch/event sync black/white list (and validators in case of black list)
	-add player interactions
	-add npc sync
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

YNOnline.Network.globalChat = new Chat();
YNOnline.Network.gameServer = new GameServer();
YNOnline.Network.connectionManager = new ConnectionManager();
YNOnline.Network.connectionManager.AddService("game", YNOnline.Network.gameServer);
YNOnline.Network.connectionManager.AddService("globalChat", YNOnline.Network.globalChat);


YNOnline.Network.localChats = [];
for(let i = 1; i < config.roomsRange.max; i++) {
	YNOnline.Network.localChats.push(new Chat());
	YNOnline.Network.connectionManager.AddService("chat"+i, YNOnline.Network.localChats[i - 1]);
}