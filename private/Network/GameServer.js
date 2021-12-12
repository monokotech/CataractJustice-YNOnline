const SoundValidator = require('../Validators/ValidateSound');
const SpriteValidator = require('../Validators/ValidateSpriteSheet');
const Room = require('./Room');
function GameServer(gameName) {
	let self = this;
	this.clients = {};
	let rooms = {};
	let playerCount = 0;
	this.soundValidator = new SoundValidator(gameName);
	this.spriteValidator = new SpriteValidator(gameName);

	this.PlayerCount = function() {
		return playerCount;
	}

	this.Connect = function(socket) 
	{	
		playerCount++;
		socket.send(JSON.stringify({
			type: "connection",
			uuid: socket.uuid
		}));

		self.clients[socket.uuid] = socket;

		socket.onmessage = function(e) {
			let connectPacket = RoomConnectPacketParse(e.data);

			if(connectPacket) {
				ConnectClientToRoom(socket, connectPacket.roomID)
			}
			else {
				if(socket.room) {
					socket.room.ProcessPacket(socket, e.data);
				}
				else {
					//something is wrong if we get here, either someone is messing with packets, or client is not working properly
					YNOnline.Network.logWarning({
						category: "invalid packets", 
						text: "client is not connected to any room and tries to send not a room connection packet", 
						packet: e.data, 
						socket: socket
						});
				}
			}
		}
	}

	this.Disconnect = function(socket) {
		playerCount--;
		DisconnectClientFromRoom(socket);
		delete self.clients[socket.uuid];
	}

	function RoomConnectPacketParse(data) {
		if(data.length == 2) {
			return {roomID: data.readUInt16LE(0)};
		}
		return undefined;
	}

	function ConnectClientToRoom(socket, roomID) {
		DisconnectClientFromRoom(socket);
		if(isValidRoomId(roomID)) {
			//create room if does not exist
			if(!rooms[roomID]) {
				rooms[roomID] = new Room(roomID, self);
			}
			socket.room = rooms[roomID];
			socket.room.Connect(socket);
		}
		else {
			socket.close();
			YNOnline.Network.logWarning({
				category: "invalid packets",
				text: "client tried to connect to room with invalid id",
				socket: socket,
				roomID: roomID
			});
		}
	}

	function DisconnectClientFromRoom(socket) {
		if(socket.room) {
			socket.room.Disconnect(socket);
			//we delete room from dictionary if it has no players, since ALOT of rooms will be with no players in them most of the time
			if(socket.room.PlayerCount() == 0) {
				delete rooms[socket.room.uid];
			}
		}
	}

	function isValidRoomId(roomID) {
		return (roomID >= config.roomsRange.min && roomID <= config.roomsRange.max);
	}

	this.GetRoomByID = function(roomID) {
		return rooms[roomID];
	}
}

module.exports = GameServer;