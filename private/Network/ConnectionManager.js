const WebSocket = require('ws');
const crypto = require('crypto');
const ClientsStorage = require('../ClientsStorage');

//ConnectionManager hosts web socket server and distributes ws connections between services
function ConnectionManager() {
	let manager = this;
	let wsserver = new WebSocket.Server({
		server: YNOnline.Network.httpServer
	});
	let services = {};

	let onConnection = function(socket, req) 
	{
		//after client connects to a websocket server, it has to send service name
  		socket.onmessage = function(e){
			let serviceName = e.data.toString();
			if(services[serviceName]) {
				socket.serviceName = serviceName;
				socket.uuid = crypto.randomUUID();
				socket.address = req.socket.remoteAddress;
				socket.name = config.defaultName;
				
				if(!ClientsStorage.SessionClients.sockets) {
					ClientsStorage.SessionClients.sockets = {};
				}

				if(!ClientsStorage.SessionClients[req.socket.remoteAddress]) {
					ClientsStorage.SessionClients[req.socket.remoteAddress] = {};
					ClientsStorage.SessionClients[req.socket.remoteAddress].uuids = [];
					ClientsStorage.SessionClients[req.socket.remoteAddress].chatignores = [];
					ClientsStorage.SessionClients[req.socket.remoteAddress].gameignores = [];
					ClientsStorage.SessionClients[req.socket.remoteAddress].sockets = {};
				}

				ClientsStorage.SessionClients[req.socket.remoteAddress].uuids.push(socket.uuid);
				ClientsStorage.SessionClients.sockets[socket.uuid] = socket;
				ClientsStorage.SessionClients[req.socket.remoteAddress].sockets[socket.uuid] = socket;
				socket.storageInstance = ClientsStorage.SessionClients[req.socket.remoteAddress];
				services[serviceName].Connect(socket);
			}
			else {
				socket.close();
			}
		};

  		socket.on('close', function() {
			if(services[socket.serviceName]) {
				services[socket.serviceName].Disconnect(socket);
			}
		});
  	}

	wsserver.on('connection', function(socket, req) {
		onConnection(socket, req);
	});

	this.AddService = function(serviceName, service) {
		services[serviceName] = service;
	}
}

module.exports = ConnectionManager;