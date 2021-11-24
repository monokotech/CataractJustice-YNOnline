
const WebSocket = require('ws');

function Broadcaster(port)
{
	var broadcaster = this;

	this.incomingMessageParse = function(socket, msg){}
	this.onClientDisconnect = function(socket){}

	this.onConnection = function(socket) 
	{
		socket.index = this.clientSockets.length;
  		this.clientSockets.push(socket);
  		socket.on('message', function(msg){broadcaster.onMessageDefault(socket, this.incomingMessageParse(msg));});
  		socket.on('close', function(){broadcaster.onCloseDefault(socket);});
  	}

	  
	this.onCloseDefault = function(socket) 
	{
		this.clientSockets = this.clientSockets.filter(s => s !== socket);
		this.onClientDisconnect(socket);
	}
		
	this.broadcast = function(msg) 
	{
		for(var i = 0; i < this.clientSockets.length; i++)
		{
			this.clientSockets[i].send(this.clientSockets[i], msg);
		}
	}
		
	this.onMessageDefault = this.broadcast;

	this.serverSocket = new WebSocket.Server({port: port});
	this.clientSockets = [];
	this.serverSocket.on('connection', function(socket){broadcaster.onConnection(socket);});
}

module.exports = Broadcaster;