

let commands = {
	help: HelpCommand,
	spriteset: SpriteSetCommand,
	spritelist: SpriteListCommand,
	ignorechat: IgnoreChatCommand,
	ignoregame: IgnoreGameCommand,
	getuuid: GetUUIDCommand,
	pvol: SetPlayersVolumeCommand,
	pardonchat: PardonChatCommand,
	pardongame: PardonGameCommand
}


function ExecuteCommand(command) {
	if(command[0] == '/')
		command = command.substr(1);

	let params = command.split(' ');
	
	if(commands[params[0]]) {
		if(!commands[params[0]](params)) {
			HelpCommand(["help", params[0]]);
		}
	} else {
		PrintChatInfo("Unknown command, use /help for help", "Commands")
	}
}

