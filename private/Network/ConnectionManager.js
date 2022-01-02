const WebSocket = require('ws');
const crypto = require('crypto');
const ClientsStorage = require('../ClientsStorage');
const Request = require('./RequestUtils');

//ConnectionManager hosts web socket server and distributes ws connections between services
function ConnectionManager() {
	let manager = this;
	let wsserver = new WebSocket.Server({
		server: YNOnline.Network.server
	});
	let services = {};
	let connections = {};

	let onConnection = function(socket, req) 
	{
		socket.address = Request.GetAddress(req);
		if(ClientsStorage.ActiveConnectionsCountOfAddress(socket.address) >= config.maxConnectionsPerAddress) {
			socket.close();
			return;
		}
		socket.name = config.defaultName;

		//if socket doesn't send service name after 3 second, disconnect it
		//to-do: add timeout to receive service name setting to configuration.js
		setTimeout(function() {
			if(!socket.serviceName) {
				socket.close();
			}
		}, 3000);

		//after client connects to a websocket server, it has to send service name
  		socket.onmessage = function(e){
			let serviceName = e.data.toString();

			if(services[serviceName]) {
				socket.serviceName = serviceName;
				socket.storageInstance = ClientsStorage.RegisterConnection(socket);
				services[serviceName].Connect(socket);

				connections[crypto.randomUUID()] = socket;
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
	//shitty ping system but it was needed only for heroku hosting anyway?
	if(config.shouldSendPings) {
		setInterval(
			function() {
				let kl = Object.keys(connections);

				for(let k of kl) {
					if(connections[k].readyState == WebSocket.OPEN) {
						connections[k].send("{ \"type\": \"ping\" }");
					} else {
						delete connections[k];
					}
				}
			},
			config.pingInterval_ms
		);
	}
}



module.exports = ConnectionManager;