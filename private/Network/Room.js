
const SyncObject = require('./SyncObject');
const EventObject = require('./EventObject');
const ClientsStorage = require('../ClientsStorage');
const Validators = require('../Validators/Validators');
const Commands = require('./Commands/Commands');

let PacketTypes =
{
	movement: 1,
	sprite: 2,
	sound: 3,
	weather: 4,
	name: 5,
	movementAnimationSpeed: 6,
	variable: 7,
	switchsync: 8,
	animtype: 9,
	animframe: 10,
	facing: 11,
	typingstatus: 12,
	syncme: 13,
	flash: 14,
	flashpause: 15,
	npcmove: 16,
	system: 17,
	npcsprite: 18,
	npcactive: 19
}

function Room (uid, gameServer) {
	this.uid = uid;
	let syncObjects = new Set();
	let clients = new Set();
	let self = this;
	let rngSeed = parseInt(Math.random() * 2147483647);
	let npcHosts = {};
	let eventObjects = {};

	let rngInterval = setInterval(function() {
		//every once in a while we change room seed so game characters don't get stuck in a movement loop
		if(self) {
			rngSeed = parseInt(Math.random() * 2147483647);
			self.Broadcast(self.NewRngSeedPacket());
		} else {
			clearInterval(rngInterval);
		}
	}, 5000);

	this.NewRngSeedPacket = function() {
		return {type: "rngSeed", seed: rngSeed};
	}

	this.PlayerCount = function() {
		return clients.size;
	}

	this.Connect = function(socket) {
		clients.add(socket);
		if(!socket.syncObject)
			socket.syncObject = new SyncObject();
		syncObjects.add(socket.syncObject);
		if(socket.name) {
			socket.syncObject.SetName({name: socket.name});
		}	else {
			socket.syncObject.SetName({name:  config.defaultName});
			socket.name = {name:  config.defaultName};
		}

		socket.send(JSON.stringify(this.NewRngSeedPacket()));

		for(let key in this.eventObjects) {
			socket.send(JSON.stringify(this.eventObjects[key]));
		}

		self.SyncAllForPlayer(socket);
		self.FullSyncPlayerForAll(socket);
	}

	this.Disconnect = function(discsocket) {
		for(let socket of clients) {
			if(socket !== discsocket)
				socket.send(JSON.stringify(NewDisconnectPacket(discsocket)));
		}
		clients.delete(discsocket);
		syncObjects.delete(discsocket.syncObject);
	}

	this.Broadcast = function(data) {
		for(let socket of clients) {
			socket.send(JSON.stringify(data));
		}
	}

	this.SyncAllForPlayer = function(syncsocket) {
		for(let socket of clients)
			if(socket !== syncsocket  && !ClientsStorage.IsClientIgnoredByClientInGame(socket, syncsocket) && !Commands.bans.game.includes(socket.uuid))
				syncsocket.send(JSON.stringify(socket.syncObject.GetFullSyncData()));
	}

	this.SyncPlayerForAll = function(syncsocket) {
		if(Commands.bans.game.includes(syncsocket.uuid))
			return;

		let syncPacket = JSON.stringify(syncsocket.syncObject.GetSyncData());
		for(let socket of clients) {
			if(socket !== syncsocket && !ClientsStorage.IsClientIgnoredByClientInGame(syncsocket, socket))
				socket.send(syncPacket);
		}
		syncsocket.syncObject.ClearSyncData();
	}

	this.FullSyncPlayerForAll = function(syncsocket) {
		if(Commands.bans.game.includes(syncsocket.uuid))
			return;

		let syncPacket = JSON.stringify(syncsocket.syncObject.GetFullSyncData());
		for(let socket of clients) {
			if(socket !== syncsocket && !ClientsStorage.IsClientIgnoredByClientInGame(syncsocket, socket))
				socket.send(syncPacket);
		}
	}

	this.ProcessPacket = function(socket, data) {
		if(data.readUInt16LE) {
		switch(data.readUInt16LE(0)) {
			case PacketTypes.movement:
				let movementData = ParseMovementPacket(data);
				if(movementData) {
					socket.syncObject.SetPosition(movementData);
				}
			break;
			
			case PacketTypes.sprite:
				let spriteData = ParseSpritePacket(data);
				if(spriteData) {
					socket.syncObject.SetSprite(spriteData);
				}
			break;

			case PacketTypes.sound:
				let soundData = ParseSoundPacket(data);
				if(soundData) {
					socket.syncObject.PlaySound(soundData);
				}
			break;	

			case PacketTypes.weather:
				let weatherData = ParseWeatherPacket(data);

				if(weatherData) {
					socket.syncObject.SetWeather(weatherData);
				}
			break;

			case PacketTypes.name: 
				let nameData = ParseNamePacket(data);
				if(nameData && Validators.ValidateName(nameData.name)) {
					socket.syncObject.SetName(nameData);
					socket.name = nameData.name;
				}
			break;
			case PacketTypes.movementAnimationSpeed:
				let movementSpeedData = ParseMovementSpeedPacket(data);
				if(movementSpeedData) {
					socket.syncObject.SetMovementSpeed(movementSpeedData);
				}
			break;
			//there was a problem with 2kki when it would set some variable every frame
			case PacketTypes.variable:
			return;
				let variableData = ParseVariableSetPacket(data);
				if(variableData) {
					socket.syncObject.SetVariable(variableData);
				}
			break;
			case PacketTypes.switchsync:
				if(config.switchsync) {
					let switchsyncData = ParseSwitchSetPacket(data);
					if(switchsyncData) {
						socket.syncObject.SetSwitch(switchsyncData);
					}
				}
			break;
			case PacketTypes.animtype:
				return;
			break;

			case PacketTypes.animframe:
				let animFramePacket = ParseAnimFramePacket(data);
				if(animFramePacket) {
					socket.syncObject.SetAnimFrame(animFramePacket);
				}
			break;
			case PacketTypes.facing:
				let facingPacket = ParseFacingPacket(data);
				if(facingPacket) {
					socket.syncObject.SetFacing(facingPacket);
				}
			break;
			case PacketTypes.typingstatus:
				let typingstatusPacket = ParseTypingstatusPacket(data);
				if(typingstatusPacket) {
					socket.syncObject.SetTypingStatus(typingstatusPacket);
				} 
			break;
			case PacketTypes.syncme:
				if(Object.keys(socket.syncObject.syncData).length > 2)
					self.SyncPlayerForAll(socket);
			break;
			case PacketTypes.flash:
				let flashPacket = ParseFlashPacket(data);
				if(flashPacket) {
					socket.syncObject.SetFlash(flashPacket);
				}
			break;
			case PacketTypes.flashpause:
				let flashPausePacket = ParseFlashPausePacket(data);

				if(flashPausePacket) {
					socket.syncObject.SetFlashPause(flashPausePacket);
				}
			break;
			case PacketTypes.npcmove:
				let npcmovePacket = ParseNpcMovePacket(data);

				if(npcmovePacket) {
					if(!npcHosts[npcmovePacket.id] || !clients.has(npcHosts[npcmovePacket.id]))
						npcHosts[npcmovePacket.id] = socket;

					if(npcHosts[npcmovePacket.id] === socket) {
						socket.syncObject.MoveNpc(npcmovePacket);
						self.SyncPlayerForAll(socket);

						if(!eventObjects[npcmovePacket.id]) eventObjects[npcmovePacket.id] = new EventObject();
							eventObjects[npcmovePacket.id].npcmove = npcmovePacket;
					}
				}
			break;
			case PacketTypes.system:
				let systemPacket = ParseSystemPacket(data);
				if(systemPacket) {
					socket.syncObject.SetSystem(systemPacket);
				}
			break;
			case PacketTypes.npcsprite:
				let npcspritePacket = ParseNpcSpritePacket(data);
				if(npcspritePacket) {
					self.Broadcast({type: "objectSync", uid: "room", npcsprite: npcspritePacket});

					if(!eventObjects[npcspritePacket.id]) eventObjects[npcspritePacket.id] = new EventObject();
						eventObjects[npcspritePacket.id].npcsprite = npcspritePacket;
				}
			break;
			case PacketTypes.npcactive:
				let npcactivityPacket = ParseNpcActivityPacket(data);
				if(npcactivityPacket) {
					self.Broadcast({type: "objectSync", uid: "room", npcactive: npcactivityPacket});

					if(!eventObjects[npcactivityPacket.id]) eventObjects[npcactivityPacket.id] = new EventObject();
						eventObjects[npcactivityPacket.id].npcactive = npcactivityPacket;
				}
			break;
		}
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

	function ParseAnimFramePacket(data) {
		//uint16 packet type, uint16 frame
		if(data.length == 4) {
			return {frame: data.readUInt16LE(2)};
		}
		return undefined;
	}

	function ParseFacingPacket(data) {
		if(data.length == 4) {
			return {facing: data.readUInt16LE(2)};
		}
		return undefined;
	}

	function ParseTypingstatusPacket(data) {
		if(data.length == 4) {
			return {typingstatus: data.readUInt16LE(2)};
		}
		return undefined;
	}

	function ParseFlashPacket(data) {
		if(data.length == 12) {
			return {flash: [data.readUInt16LE(2), data.readUInt16LE(4), data.readUInt16LE(6), data.readUInt16LE(8), data.readUInt16LE(10)]}
		}
		return undefined;
	}

	function ParseFlashPausePacket(data) {
		if(data.length == 4) {
			return {flashpause: (data.readUInt16LE(2) == 0 ? 0 : 1)};
		}
		return undefined;
	}

	function ParseNpcMovePacket(data) {
		if(data.length == 10) {
			return {x: data.readUInt16LE(2), y: data.readUInt16LE(4), facing: data.readUInt16LE(6), id: data.readUInt16LE(8)};
		}
		return undefined;
	}

	function ParseSystemPacket(data) {
		if(data.length > 2) {
			let systemPacket = {system: data.toString().substr(2)};
			if(gameServer.systemValidator.isValidSystem(systemPacket.system))
				return systemPacket;
		}
		return undefined;
	}

	function ParseNpcSpritePacket(data) {
		if(data.length > 6) {
			return {id: data.readUInt16LE(2), index: data.readUInt16LE(4), sheet: data.toString().substr(6)};
		}
		return undefined;
	}

	function ParseNpcActivityPacket(data) {
		if(data.length == 6)
			return {id: data.readUInt16LE(2), active: data.readUInt16LE(4)};
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