
const WebSocket = require('ws');

let SessionClients = {
	sockets: {}
}

function RegisterConnection(socket) {
	if(!SessionClients[socket.address]) {
		SessionClients[socket.address] = {};
		SessionClients[socket.address].uuids = [];
		SessionClients[socket.address].chatignores = [];
		SessionClients[socket.address].gameignores = [];
		SessionClients[socket.address].sockets = {};
	}

	SessionClients[socket.address].uuids.push(socket.uuid);

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
		connectionsCount += (state === WebSocket.CONNECTING || state === WebSocket.OPEN) ? 1 : 0;
	}

	return connectionsCount;
}

module.exports = {SessionClients, RegisterConnection, IsClientIgnoredByClientInChat, IsClientIgnoredByClientInGame, ActiveConnectionsCountOfAddress }