
const SyncObject = require('./SyncObject');
const ClientsStorage = require('../ClientsStorage');
const Validators = require('../Validators/Validators');

let PacketTypes =
{
	movement: 1,
	sprite: 2,
	sound: 3,
	weather: 4,
	name: 5,
	movementAnimationSpeed: 6,
	variable: 7,
	switchsync: 8
}

function Room (uid, gameServer) {
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
		if(socket.name) {
			socket.syncObject.SetName({name: socket.name});
		}	else {
			socket.syncObject.SetName({name:  config.defaultName});
			socket.name = {name:  config.defaultName};
		}
		self.SyncAllForPlayer(socket);
		self.FullSyncPlayerForAll(socket);
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
			if(socket.uuid != syncsocket.uuid  && !ClientsStorage.IsClientIgnoredByClientInGame(socket, syncsocket))
				syncsocket.send(JSON.stringify(socket.syncObject.GetFullSyncData()));
	}

	this.SyncPlayerForAll = function(syncsocket) {
		let syncPacket = JSON.stringify(syncsocket.syncObject.GetSyncData());
		for(let socket of clients) {
			if(socket.uuid != syncsocket.uuid && !ClientsStorage.IsClientIgnoredByClientInGame(syncsocket, socket))
				socket.send(syncPacket);
		}
		syncsocket.syncObject.ClearSyncData();
	}

	this.FullSyncPlayerForAll = function(syncsocket) {
		let syncPacket = JSON.stringify(syncsocket.syncObject.GetFullSyncData());
		for(let socket of clients) {
			if(socket.uuid != syncsocket.uuid && !ClientsStorage.IsClientIgnoredByClientInGame(syncsocket, socket))
				socket.send(syncPacket);
		}
	}

	this.ProcessPacket = function(socket, data) {
		let packet;
		if(data.readUInt16LE) {
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
			break;
			case PacketTypes.movementAnimationSpeed:
				let movementSpeedData = ParseMovementSpeedPacket(data);
				if(movementSpeedData) {
					socket.syncObject.SetMovementSpeed(movementSpeedData);
				} else {
					YNOnline.Network.logWarning({
						tags: ["invalid packets"],
						text: "invalid movement speed packet",
						extra: {
							socket: socket,
							data: data
						}
					});
				}
			break;
			//there was a problem with 2kki when it would set some variable every frame
			case PacketTypes.variable:
			return;
				let variableData = ParseVariableSetPacket(data);
				if(variableData) {
					socket.syncObject.SetVariable(variableData);
				} else {
					YNOnline.Network.logWarning({
						tags: ["invalid packets"],
						text: "invalid variable packet",
						extra: {
							socket: socket,
							data: data
						}
					});
				}
			break;
			case PacketTypes.switchsync:
				let switchsyncData = ParseSwitchSetPacket(data);
				if(switchsyncData) {
					socket.syncObject.SetSwitch(switchsyncData);
				} else {
					YNOnline.Network.logWarning({
						tags: ["invalid packets"],
						text: "invalid switch packet",
						extra: {
							socket: socket,
							data: data
						}
					});
				}
			break;
		}

		self.SyncPlayerForAll(socket);
		}
	}

	function ParseMovementPacket(data) {
		//uint16 packet type, uint16 X, uint16_t Y
		if(data.length == 6) {
			return {x: data.readUInt16LE(2), y: data.readUInt16LE(4)};
		}
		return undefined;
	}

	function ParseSpritePacket(data) {
		//uint16 packet type, uint16 sprite 'id', string spritesheet
		if(data.length > 4) {
			let parsedData = {id: data.readUInt16LE(2), sheet: data.toString().substr(4)};
			if(parsedData.id >= 0 && parsedData.id < 8) {
				if(gameServer.spriteValidator.isValidSpriteSheet(parsedData.sheet))
					return parsedData;
			}
		}
		return undefined;
	}

	function ParseSoundPacket(data) {
		//uint16 packet type, uint16 volume, uint16 tempo, uint16 balance, string sound file
		if(data.length > 8) {
			let parsedData = {volume: data.readUInt16LE(2), tempo: data.readUInt16LE(4), balance: data.readUInt16LE(6), name: data.toString().substr(8)};
			if(
				parsedData.volume >= 0 && parsedData.volume <= 100 &&
				parsedData.tempo >= 50 && parsedData.tempo <= 200
			) {
				if(gameServer.soundValidator.isValidSoundFile(parsedData.name))
					return parsedData;
			}
		}

		return undefined;
	}

	function ParseWeatherPacket(data) {
		//uint16 packet type, uint16 weather type, uint16 weather strength
		if(data.length == 6) {
			let type = data.readUInt16LE(2);
			let str = data.readUInt16LE(4);
			if(str >= 0 && str <= 2 && type >= 0 && type < 4)
				return {type: type, strength: str};
		}
		
		return undefined;
	}

	function ParseNamePacket(data) {
		//uint16 packet type, string name
		if(data.length > 2) {
			return {name: data.toString().substr(2)};
		}
		return undefined;
	}

	function ParseMovementSpeedPacket(data) {
		//uint16 packet type, uint16 movement speed
		if(data.length == 4) {
			return {movementAnimationSpeed: data.readUInt16LE(2)};
		}
		return undefined;
	}

	function ParseVariableSetPacket(data) {
		//uint16 packet type, uint32 var id, int32 value
		if(data.length == 10) {
			return {id: data.readUInt32LE(2), value: data.readUInt32LE(6)};
		}
		return undefined;
	}

	function ParseSwitchSetPacket(data) {
		//uint16 packet type, uint32 switch id, int32 value
		if(data.length == 10) {
			return {id: data.readUInt32LE(2), value: data.readUInt32LE(6)};
		}
		return undefined;
	}

	function NewDisconnectPacket(socket) {
		return {type: "disconnect", uuid: socket.syncObject.uid};
	}

	//returns uuid list of clients connected to that room, used for /getuuid command
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