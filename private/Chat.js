
const WebSocket = require('ws');

function Chat(port)
{
	var self = this;

	this.onConnection = function(socket) 
	{
  		this.clientSockets.push(socket);
  		socket.on('message', function(msg){self.onMessage(msg);});
  		socket.on('close', function(){self.onClose(socket);});
  	}

	this.onMessage = function(msg) 
	{
		for(var i = 0; i < this.clientSockets.length; i++)
			this.clientSockets[i].send(msg);
	}

	this.onClose = function(socket) 
	{
    	this.clientSockets = this.clientSockets.filter(s => s !== socket);
  	}

	this.serverSocket = new WebSocket.Server({port: port});
	this.clientSockets = [];
	this.serverSocket.on('connection', function(socket){self.onConnection(socket);});
}

module.exports = Chat;