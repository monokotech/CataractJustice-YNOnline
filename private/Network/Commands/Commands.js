const Ignores = require("./Ignores");

let bans = {
	chat: [],
	game: []
}

let oplist = ["MeeRoI2vww"];

function BanChatCommand(socket, args) {
	if(args.length == 2) {
		bans.chat.push(args[1]);
		return "User added to chat ban list";
	}
	return "Invalid arguments use /banchat <uuid>";
}

function BanGameCommand(socket, args) {
	if(args.length == 2) {
		bans.game.push(args[1]);
		return "User added to game ban list";
	}
	return "Invalid arguments use /bangame <uuid>";
}

function BanList(socket, args) {
	let responce = "";
	responce += "chat: \n"
	for(let uuid of bans.chat)
		responce += uuid + "\n";

	responce += "game: \n"
	for(let uuid of bans.game)
		responce += uuid + "\n";

	return responce;
}

let OpCommandsList = {
	banchat: BanChatCommand,
	bangame: BanGameCommand,
	banlist: BanList
}

let CommandsList = {
	ignorechat: Ignores.IgnoreChat,
	ignoregame: Ignores.IgnoreGame,
	pardonchat: Ignores.PardonChat,
	pardongame: Ignores.PardonGame,
	getuuid: Ignores.GetUUID
}

function ExecuteCommand(socket, args) {
	let command = args[0];

	if(oplist.includes(socket.trip)) {
		if(OpCommandsList[command]) {
			return OpCommandsList[command](socket, args);
		}
	}

	if(CommandsList[command]) {
		return CommandsList[command](socket, args);
	}

	return "Unknown remote command "+command+"."
}

module.exports = {ExecuteCommand, bans}