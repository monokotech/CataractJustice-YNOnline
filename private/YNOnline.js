const WebSocket = require('ws');
const Chat = require('./Chat');

global.YNOnline = 
{
	Network: 
	{
		globalChat: new Chat(15000),
	}
};