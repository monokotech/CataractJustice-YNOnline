const WebSocket = require('ws');
const Chat = require('./Chat');

global.YNOnline = 
{
	Network: 
	{
		gameport: 0,
		chatport: 0,
		globalChat: null
	}
};

function main () 
{
	if(process.argv.length != 4) 
	{
		console.log("usage: node YNOnline.js <game port> <chat port>");
		process.exit();
	}
	console.log("press ctrl + C to exit");
	
	YNOnline.Network.gameport = parseInt(process.argv[2]);
	YNOnline.Network.chatport = parseInt(process.argv[3]);
	YNOnline.Network.globalChat = Chat.NewChat(YNOnline.Network.chatport);
}

main();