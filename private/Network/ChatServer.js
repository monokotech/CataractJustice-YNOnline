const ChatRoom = require('./ChatRoom');

function ChatServer (gameName) {
	let chatRooms = {};
	this.Connect = function (socket) {

		socket.onmessage = function(e) {
			let roomName = e.data.toString();
			if(roomName.length > 16) {
				socket.close();
				return;
			}
			
			if(!chatRooms[roomName])
				chatRooms[roomName] = new ChatRoom(gameName);

			chatRooms[roomName].Connect(socket);
			socket.chatRoomName = roomName;
			socket.gameName = gameName;
			socket.send(JSON.stringify(
				{
				type: "playersCount",
				count: chatRooms[roomName].ClientsCount()
				}
			));
		}
	}

	this.Disconnect = function(socket) {
		if(socket.chatRoomName) {	
			chatRooms[socket.chatRoomName].Disconnect(socket);

			if(chatRooms[socket.chatRoomName].ClientsCount() <= 0) {
				delete chatRooms[socket.chatRoomName];
			}
		}
	}
}

module.exports = ChatServer;