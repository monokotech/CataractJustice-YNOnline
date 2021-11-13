let gloabalChatAddress = "";

function Chat (socket_address) 
{
	this.socket = new WebSocket(socket_address);
	this.messages = [];
}

YNOnline.Network.globalChat = new Chat(gloabalChatAddress);
YNOnline.Network.localChar = null;