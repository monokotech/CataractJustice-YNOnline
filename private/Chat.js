const Broadcaster = require('./Network/Broadcaster');

function NewChat(port) {
	broadcaster = new Broadcaster(port);

	broadcaster.onClientDisconnect = function(socket) 
	{
		broadcaster.broadcast("d" + socket.index);
	}

	broadcaster.incomingMessageParse = function(socket, imsg) {
		var omsg = [];
		omsg.push(this.clientSockets.indexOf(socket));
		omsg.push(imsg);
		return omsg;
	}

	return broadcaster;
}

module.exports = {NewChat};