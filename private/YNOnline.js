require('./configuration');
const Chat = require('./Chat');
const GameServer = require('./Network/GameServer');
const ConnectionManager = require('./Network/ConnectionManager');

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
		logWarning: function(args) {console.log(args.text);},
		logEWarning: function(args) {console.log(args);}
	}
};

function main () 
{
	console.log("press ctrl + C to exit");
	YNOnline.Network.globalChat = Chat.NewChat();
	YNOnline.Network.gameServer = new GameServer();
	YNOnline.Network.connectionManager = new ConnectionManager(config.port);
	YNOnline.Network.connectionManager.AddService("game", YNOnline.Network.gameServer);
	YNOnline.Network.connectionManager.AddService("globalChat", YNOnline.Network.globalChat);

	YNOnline.Network.localChats = [];
	for(let i = 1; i < config.roomsRange.max; i++) {
		YNOnline.Network.localChats.push(Chat.NewChat());
		YNOnline.Network.connectionManager.AddService("chat"+i, YNOnline.Network.localChats[i - 1]);
	}
}

main();