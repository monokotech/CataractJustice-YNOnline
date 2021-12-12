
function ServerListing () {
	this.Connect = function(socket) {
		let responce = {};
		
		for(let game of config.gamesList) {
			responce[game] = {playerCount: YNOnline.Network.gameServer[game].PlayerCount()};
		}

		socket.send(JSON.stringify(responce));
		socket.close();
	}

	this.Disconnect = function() {
		return;
	}
}

module.exports = ServerListing;