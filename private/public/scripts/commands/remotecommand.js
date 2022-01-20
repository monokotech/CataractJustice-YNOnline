function RemoteCommand(args) {
	YNOnline.Network.globalChat.SendMessage(JSON.stringify({
		command: args
	}));
	return true;
}