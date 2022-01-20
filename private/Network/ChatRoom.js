const ClientsStorage = require('../ClientsStorage');
const tripcode = require('tripcode');
const Validators = require('../Validators/Validators');
const Commands = require('./Commands/Commands');

function ChatRoom(gameName) {
	let clients = new Set();
	let self = this;

	this.ClientsCount = function() {
		return clients.size;
	}

	function Broadcast(broadsocket, message, otherSocketsOnly) {
		if(Commands.bans.chat.includes(broadsocket.uuid))
			return;

		for(let socket of clients) {
			if(!ClientsStorage.IsClientIgnoredByClientInChat(broadsocket, socket) && !(otherSocketsOnly && socket.uuid == broadsocket.uuid))
				if(typeof message == 'object')
					socket.send(JSON.stringify(message));
				else
					socket.send(message);
		}
	}

	this.Disconnect = function(socket) 
	{	
		if(socket.name && socket.trip) {
			Broadcast(socket, {
				type: "roomDisconnect",
				name: socket.name,
				trip: socket.trip
			});
		}
		clients.delete(socket);
	}

	this.Connect = function(socket) {
		clients.add(socket);

		socket.onmessage = function(e) {
			let msgjson;
			try {
				msgjson = JSON.parse(e.data);
			} catch (err) {
				YNOnline.Network.logWarning({
					tags: ["invalid packets", "invalid json"],
					text: "invalid json when receiving chat message"
				}
				);
				return;			
			}

			if(msgjson.type == "pong")
				return;

			if(socket.name && socket.trip) {
				
				if(Array.isArray(msgjson.command)) {
					socket.send(JSON.stringify({type: "serverInfo", text: Commands.ExecuteCommand(socket, msgjson.command)}));
				}

				if(typeof msgjson.text === "string")
					Broadcast(socket, JSON.stringify({type: "userMessage", text: msgjson.text, name: socket.name, trip: socket.trip}));
			}
			else {
				if(typeof msgjson.name !== "string" || typeof msgjson.trip !== "string") {
					YNOnline.Network.logWarning({
						tags: [
							"invalid packets",
							"invalid json"
						],
						text: "name or tripcode is not a string",
						extra: {
							socket: socket,
							packet: msgjson
						}
					});
					return;
				}
				else {

					if(!Validators.ValidateName(msgjson.name))
						return;

					socket.name = msgjson.name;
					socket.trip = tripcode(msgjson.trip);

					for(let s of ClientsStorage.SessionClients[socket.address].sockets) {
						if(s)
						s.trip = socket.trip;
					}

					Broadcast(socket, JSON.stringify({type: "userConnect", name: socket.name, trip: socket.trip}), true);
				}
			}
		}
	}
}

module.exports = ChatRoom;