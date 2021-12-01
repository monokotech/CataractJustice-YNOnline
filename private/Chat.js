const Broadcaster = require('./Network/Broadcaster');
const ClientsStorage = require('./ClientsStorage');
const tripcode = require('tripcode');


function NewChat() {
	broadcaster = new Broadcaster();

	broadcaster.onClientDisconnect = function(socket) 
	{	
		if(socket.name && socket.trip) {
			broadcaster.broadcast(socket, {
				type: "serverInfo",
				category: "roomDisconnectInfo",
				text: "Player " + socket.name + " [" + socket.trip.substr(0, Math.min(socket.trip.length - 1, 6)) + "...] left this room."
			});
		}
	}

	broadcaster.incomingMessagePreprocess = function(socket, imsg) {
		if(socket.name && socket.trip) {

				if(imsg.ignorechat) {
					if(imsg.ignorechat.uuid && typeof imsg.ignorechat.uuid === "string") {
						let ignoredSocket = ClientsStorage.SessionClients.sockets[imsg.ignorechat.uuid];
						if(ignoredSocket) {
							ignoredSocket.storageInstance.chatignores.push(socket.trip)
							return {type: "serverInfo", text: "User succesfully ignored"};
						}
					}
					return {type: "serverInfo", text: "Failed to ignore player"};
				}

				if(imsg.ignoregame) {
					if(imsg.ignoregame.uuid && typeof imsg.ignoregame.uuid === "string") {
						let ignoredSocket = ClientsStorage.SessionClients.sockets[imsg.ignoregame.uuid];
						if(ignoredSocket) {
							ignoredSocket.storageInstance.gameignores.push(socket.trip)
							return {type: "serverInfo", text: "User succesfully ignored"};
						}
					}
					return {type: "serverInfo", text: "Failed to ignore player"};
				}

				if(imsg.getuuid) {

					let responce = "";

					if(imsg.getuuid == "*") {
						if(!isNaN(parseInt(imsg.room))) {
							let clients = YNOnline.Network.gameServer.GetRoomByID(parseInt(imsg.room)).GetClients();
							for(let client of clients) {
								responce += client.name;
								responce += ": ";
								responce += client.uuid;
								responce += "\n";
							}
						}
					} else {

						for(let k in broadcaster.clientSockets) {
							if(broadcaster.clientSockets.hasOwnProperty(k)) {
								if(broadcaster.clientSockets[k].trip === imsg.getuuid) {
									responce = k;
									break;
								}
							}
						}
					}

					return {type: "serverInfo", text: responce};
				}

			return{type: "userMessage", text: imsg.text, name: socket.name, trip: socket.trip};
		}
		else {
			if(typeof imsg.name != "string" || typeof imsg.trip != "string") {
				YNOnline.Network.logWarning({
					tags: [
						"invalid packets",
						"invalid json",
					],
					text: "invalid json values when receiving chat profile info",
					extra: {
						socket: socket,
						packet: imsg
					}
				});
				return;
			}
			else {
				socket.name = imsg.name;
				socket.trip = tripcode(imsg.trip);
				let allsocks = ClientsStorage.SessionClients[socket.address].uuids;
				for(let s of allsocks) {
					ClientsStorage.SessionClients[socket.address].sockets[s].trip = socket.trip;
				}
				return {type: "userConnect", name: socket.name, trip: socket.trip};
			}
		}
	}

	return broadcaster;
}

module.exports = {NewChat};