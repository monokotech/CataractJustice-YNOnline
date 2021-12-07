
const WebSocket = require('ws');
const ClientsStorage = require('../ClientsStorage');

function Broadcaster()
{
	var broadcaster = this;
	
	this.incomingMessagePreprocess = function(socket, msg){return msg;}
	this.onClientDisconnect = function(socket){}

	this.Connect = function(socket) 
	{
		broadcaster.clientSockets[socket.uuid] = socket;
  			socket.onmessage = function(e){
			try {
				broadcaster.onMessageDefault(socket, broadcaster.incomingMessagePreprocess(socket, JSON.parse(e.data)));
			}
			catch(error) {
				YNOnline.Network.logEWarning(error);
			}
		};
  	}

	  
	this.Disconnect = function(socket) 
	{
		delete broadcaster.clientSockets[socket.uuid];
		broadcaster.onClientDisconnect(socket);
	}
		
	this.broadcast = function(broadsocket, msg) 
	{
		for(let uuid in broadcaster.clientSockets)
		{
			if(broadcaster.clientSockets.hasOwnProperty(uuid)) {
				let socket = broadcaster.clientSockets[uuid];
				
				if(!ClientsStorage.IsClientIgnoredByClientInChat(broadsocket, socket))
					socket.send(JSON.stringify(msg));
			}
		}
	}
		
	this.onMessageDefault = function(socket, msg) {
		if(msg != null)
			broadcaster.broadcast(socket, msg);
	};

	this.clientSockets = {};
}

module.exports = Broadcaster;