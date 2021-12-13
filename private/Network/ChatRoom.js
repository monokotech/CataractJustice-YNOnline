const ClientsStorage = require('../ClientsStorage');
const tripcode = require('tripcode');

function ChatRoom(gameName) {
	let clients = new Set();
	let self = this;

	this.ClientsCount = function() {
		return clients.size;
	}

	function Broadcast(broadsocket, message) {
		for(let socket of clients) {
			if(!ClientsStorage.IsClientIgnoredByClientInChat(broadsocket, socket))
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

				if(msgjson.pardonchat) {
					if(typeof msgjson.pardonchat.uuid === "string") {
						let ignoredSocket = ClientsStorage.SessionClients.sockets[msgjson.pardonchat.uuid];
						if(ignoredSocket) {
							ignoredSocket.storageInstance.chatignores = ignoredSocket.storageInstance.chatignores.filter(uuid => uuid == msgjson.pardonchat.uuid);
							socket.send(JSON.stringify({type: "serverInfo", text: "User succesfully unignored"}));
							return;
						}
					}
					socket.send(JSON.stringify({type: "serverInfo", text: "Failed to unignore player"}));
					return;
				}

				if(msgjson.pardongame) {
					if(typeof msgjson.pardongame.uuid === "string") {
						let ignoredSocket = ClientsStorage.SessionClients.sockets[msgjson.pardongame.uuid];
						if(ignoredSocket) {
							ignoredSocket.storageInstance.gameignores = ignoredSocket.storageInstance.gameignores.filter(uuid => uuid == msgjson.pardongame.uuid);
							socket.send(JSON.stringify({type: "serverInfo", text: "User succesfully unignored"}));
							return;
						}
					}
					socket.send(JSON.stringify({type: "serverInfo", text: "Failed to unignore player"}));
					return;
				}

				if(msgjson.ignorechat) {
					if(typeof msgjson.ignorechat.uuid === "string") {
						let ignoredSocket = ClientsStorage.SessionClients.sockets[msgjson.ignorechat.uuid];
						if(ignoredSocket) {
							ignoredSocket.storageInstance.chatignores.push(socket.trip)
							socket.send(JSON.stringify({type: "serverInfo", text: "User succesfully ignored"}));
							return;
						}
					}
					socket.send(JSON.stringify({type: "serverInfo", text: "Failed to ignore player"}));
					return;
				}

				if(msgjson.ignoregame) {
					if(typeof msgjson.ignoregame.uuid === "string") {
						let ignoredSocket = ClientsStorage.SessionClients.sockets[msgjson.ignoregame.uuid];
						if(ignoredSocket) {
							ignoredSocket.storageInstance.gameignores.push(socket.trip)
							socket.send(JSON.stringify({type: "serverInfo", text: "User succesfully ignored"}));
							return;
						}
					}
					socket.send(JSON.stringify({type: "serverInfo", text: "Failed to ignore player"}));
					return;
				}

				if(msgjson.getuuid) {

					let responce = "";
	
					if(msgjson.getuuid == "*") {
						if(!isNaN(parseInt(msgjson.room))) {
							let clients = YNOnline.Network.gameServer[gameName].GetRoomByID(parseInt(msgjson.room)).GetClients();
							for(let client of clients) {
								responce += client.name;
								responce += ": ";
								responce += client.uuid;
								responce += "\n";
							}
						}
					} else if(typeof msgjson === "string"){
						for(let client of clients) {
							if(client.trip === msgjson.getuuid) {
								responce = client.uuid;
								break;
							}
						}
					}
					socket.send(JSON.stringify({type: "serverInfo", text: responce}));
					return;
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
					socket.name = msgjson.name;
					socket.trip = tripcode(msgjson.trip);
					Broadcast(socket, JSON.stringify({type: "userConnect", name: socket.name, trip: socket.trip}));

					//here im setting tripcode of every connection that has same IP to new received tripcode, which is stupid but i will not fix that until somebody will notice that
					//im doing that so room code will get acces to tripcode of a user since tripcode needed to see if any user is ignored by this user
					let allsocks = ClientsStorage.SessionClients[socket.address].uuids;
					for(let s of allsocks) {
						ClientsStorage.SessionClients[socket.address].sockets[s].trip = socket.trip;
					}
				}
			}
		}
	}
}

module.exports = ChatRoom;