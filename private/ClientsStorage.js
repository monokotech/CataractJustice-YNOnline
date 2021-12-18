const crypto = require('crypto');
const WebSocket = require('ws');

let SessionClients = {
	sockets: {}
}

function RegisterConnection(socket) {
	if(!SessionClients[socket.address]) {
		SessionClients[socket.address] = {};
		SessionClients[socket.address].uuids = [crypto.randomUUID()];
		SessionClients[socket.address].chatignores = [];
		SessionClients[socket.address].gameignores = [];
		SessionClients[socket.address].sockets = {};
	}

	SessionClients[socket.address].uuidsc = 0;

	socket.uuid = SessionClients[socket.address].uuids[0];

	SessionClients[socket.address].sockets[socket.uuid] = socket;
	SessionClients.sockets[socket.uuid] = socket;
	return SessionClients[socket.address];
}

function IsClientIgnoredByClientInChat(socketA, socketB) {
	return SessionClients[socketA.address].chatignores.includes(socketB.trip);
}

function IsClientIgnoredByClientInGame(socketA, socketB) {
	return SessionClients[socketA.address].gameignores.includes(socketB.trip);
}

function ActiveConnectionsCountOfAddress(address) {
	if(!SessionClients[address])
		return 0;

	let kl = Object.keys(SessionClients[address].sockets);
	let connectionsCount = 0;

	for(let k of kl) {
		let state = SessionClients[address].sockets[k].readyState;
		if((state === WebSocket.CONNECTING || state === WebSocket.OPEN))
			connectionsCount++;
		else
			delete SessionClients[address].sockets[k];
	}

	return connectionsCount;
}

module.exports = {SessionClients, RegisterConnection, IsClientIgnoredByClientInChat, IsClientIgnoredByClientInGame, ActiveConnectionsCountOfAddress }