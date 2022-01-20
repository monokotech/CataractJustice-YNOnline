const ClientsStorage = require('../../ClientsStorage');


function PardonChat(socket, args) {
	if(args.length != 2)
		return;

	let ignoredSocket = ClientsStorage.SessionClients.sockets[args[1]];

	if(ignoredSocket) {
		ignoredSocket.storageInstance.chatignores = ignoredSocket.storageInstance.chatignores.filter(uuid => uuid == socket.uuid);
		return "User succesfully unignored.";
	}

	return "Failed to uningore user";
}

function PardonGame(socket, args) {
	if(args.length != 2)
		return;

	let ignoredSocket = ClientsStorage.SessionClients.sockets[args[1]];

	if(ignoredSocket) {
		ignoredSocket.storageInstance.gameignores = ignoredSocket.storageInstance.gameignores.filter(uuid => uuid == socket.uuid);
		return "User succesfully unignored.";
	}
	
	return "Failed to uningore user";
}

function IgnoreChat(socket, args) {
	if(args.length == 2) {
		let ignoredSocket = ClientsStorage.SessionClients.sockets[args[1]];
		if(ignoredSocket) {
			ignoredSocket.storageInstance.chatignores.push(socket.trip);
			return "User succesfully ignored";
		}

		return "Failed to ignore player";
	}
}

function IgnoreGame(socket, args) {
	if(args.length == 2) {
		let ignoredSocket = ClientsStorage.SessionClients.sockets[args[1]];
		if(ignoredSocket) {
			ignoredSocket.storageInstance.gameignores.push(socket.trip);
			return "User succesfully ignored";
		}

		return "Failed to ignore player";
	}
}

function GetUUID(socket, args) {
	let responce = "";

	if(args.length == 2) { 
		if(!isNaN(parseInt(args[1]))) {
			let room = (YNOnline.Network.gameServer[socket.gameName].GetRoomByID(parseInt(args[1])));
			if(!room)
				return "Invalid room";
			
			let clients = room.GetClients();
			for(let client of clients) {
				responce += (typeof client.name === "string") ? client.name : "[Unnamed]";
				responce += ": ";
				responce += client.uuid;
				responce += "\n";
			}
		}
	}
	return responce;
}				

module.exports = {PardonChat, PardonGame, IgnoreChat, IgnoreGame, GetUUID};