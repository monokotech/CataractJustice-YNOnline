const Ignores = require("./Ignores");

let bans = {
	chat: [],
	game: []
}

let oplist = [];

function BanChatCommand(socket, args) {
	if(args.length == 2) {
		bans.chat.push(args[1]);
	}
}

function BanGameCommand(socket, args) {
	if(args.length == 2) {
		bans.game.push(args[1]);
	}
}

let OpCommandsList = {
	banchat: BanChatCommand,
	bangame: BanGameCommand
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