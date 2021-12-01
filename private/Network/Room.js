
const SyncObject = require('./SyncObject');
const Validators = require('../Validators/Validators');
const ClientsStorage = require('../ClientsStorage');

let PacketTypes =
{
	movement: 1,
	sprite: 2,
	sound: 3,
	weather: 4,
	name: 5
}

function Room (uid) {
	this.uid = uid;
	let syncObjects = new Set();
	let clients = new Set();
	let self = this;

	this.PlayerCount = function() {
		return clients.size;
	}

	this.Connect = function(socket) {
		clients.add(socket);
		socket.syncObject = new SyncObject();
		syncObjects.add(socket.syncObject);
		self.SyncAllForPlayer(socket);
	}

	this.Disconnect = function(discsocket) {
		for(let socket of clients) {
			if(socket.uuid != discsocket.uuid)
				socket.send(JSON.stringify(NewDisconnectPacket(discsocket)));
		}
		clients.delete(discsocket);
		syncObjects.delete(discsocket.syncObject);
	}

	this.SyncAllForPlayer = function(syncsocket) {
		for(let socket of clients)
			if(socket.uuid != syncsocket.uuid)
				syncsocket.send(JSON.stringify(socket.syncObject.GetFullSyncData()));
	}

	this.SyncPlayerForAll = function(syncsocket) {
		let syncPacket = JSON.stringify(syncsocket.syncObject.GetSyncData());
		for(let socket of clients) {
			if(socket.uuid != syncsocket.uuid && !ClientsStorage.SessionClients[syncsocket.address].gameignores.includes(syncsocket.trip))
				socket.send(syncPacket);
		}
		syncsocket.syncObject.ClearSyncData();
	}

	let NewFullSyncData = function() {
		let syncData = {type: "fullSync", data: []};
		for(let syncObject of syncObjects) {
			syncData.data.push(syncObject.GetFullSyncData());
		}
		return syncData;
	}

	this.ProcessPacket = function(socket, data) {
		let packet;
		switch(data.readUInt16LE(0)) {
			case PacketTypes.movement:
				let movementData = ParseMovementPacket(data);
				if(movementData)
					socket.syncObject.SetPosition(movementData);
				else {
					YNOnline.Network.logWarning({
						tags: ["invalid packets"],
						text: "invalid movement packet",
						extra: {
							socket: socket,
							data: data
						}
					});
				}
			break;
			
			case PacketTypes.sprite:
				let spriteData = ParseSpritePacket(data);

				if(spriteData)
					socket.syncObject.SetSprite(spriteData);
				else {
					YNOnline.Network.logWarning({
						tags: ["invalid packets"],
						text: "invalid sprite packet",
						extra: {
							socket: socket,
							data: data
						}
					});
				}
			break;

			case PacketTypes.sound:
				let soundData = ParseSoundPacket(data);
				if(soundData) {
					socket.syncObject.PlaySound(soundData);
				}
				else {
					YNOnline.Network.logWarning({
						tags: ["invalid packets"],
						text: "invalid sound packet",
						extra: {
							socket: socket,
							data: data
						}
					});
				}
			break;	

			case PacketTypes.weather:
				let weatherData = ParseWeatherPacket(data);

				if(weatherData) {
					socket.syncObject.SetWeather(weatherData);
				} else {
					YNOnline.Network.logWarning({
						tags: ["invalid packets"],
						text: "invalid weather packet",
						extra: {
							socket: socket,
							data: data
						}
					});
				}
			break;

			case PacketTypes.name: 
				let nameData = ParseNamePacket(data);
				if(nameData && Validators.ValidateName(nameData.name)) {
					socket.syncObject.SetName(nameData);
					socket.name = nameData.name;
				} else {
					YNOnline.Network.logWarning({
						tags: ["invalid packets"],
						text: "invalid name packet",
						extra: {
							socket: socket,
							data: data
						}
					});
				}
		}

		self.SyncPlayerForAll(socket);
	}

	function ParseMovementPacket(data) {
		if(data.length == 6) {
			return {x: data.readUInt16LE(2), y: data.readUInt16LE(4)};
		}
		return undefined;
	}

	function ParseSpritePacket(data) {
		if(data.length > 4) {
			let parsedData = {id: data.readUInt16LE(2), sheet: data.toString().substr(4)};
			if(parsedData.id >= 0 && parsedData.id < 8) {
				if(Validators.ValidateSpriteSheet(parsedData.sheet))
					return parsedData;
			}
		}
		return undefined;
	}

	function ParseSoundPacket(data) {
		if(data.length > 8) {
			let parsedData = {volume: data.readUInt16LE(2), tempo: data.readUInt16LE(4), balance: data.readUInt16LE(6), name: data.toString().substr(8)};
			if(
				parsedData.volume >= 0 && parsedData.volume <= 100 &&
				parsedData.tempo >= 50 && parsedData.tempo <= 200
			) {
				if(Validators.ValidateSound(parsedData.name))
					return parsedData;
			}
		}

		return undefined;
	}

	function ParseWeatherPacket(data) {
		if(data.length == 6) {
			let type = data.readUInt16LE(2);
			let str = data.readUInt16LE(4);
			if(str >= 0 && str <= 2 && type >= 0 && type < 4)
				return {type: type, strength: str};
		}
		
		return undefined;
	}

	function ParseNamePacket(data) {
		if(data.length > 2) {
			return {name: data.toString().substr(2)};
		}
		return undefined;
	}

	function NewDisconnectPacket(socket) {
		return {type: "disconnect", uuid: socket.syncObject.uid};
	}

	this.GetUUIDs = function() {
		let uuids = [];
		for(let client of clients) {
			uuids.push(client.uuid);
		}
		return uuids;
	}

	this.GetClients = function() {
		return clients;
	}
}

module.exports = Room;