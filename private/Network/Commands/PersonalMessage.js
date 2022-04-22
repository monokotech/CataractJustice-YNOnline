
function PersonalMessage(socket, args) {
	let chat = socket.chatRoom;
	if(args.length < 3) {
		return "Invalid arguments, usage: /pm <uuid> <message>, you can see uuid of the user next to their name, after # sign"
	}
	let receiver = chat.GetSocketByUUID(args[1]);
	if(receiver) {
		let message = "" + args.slice(2, args.length).join(' ');
		chat.SendFromSocketToUUID(socket, args[1], {type: "userMessage", text: message, name: socket.name + "#" + socket.uuid + "->me", trip: socket.trip});
		return "me->" + receiver.name + ": " + message;
 	} else {
		return "Failed to send personal message, user with such uuid is not online";
	}

	return "Something went wrong while sending personal message, please report this bug";
}

module.exports = PersonalMessage;