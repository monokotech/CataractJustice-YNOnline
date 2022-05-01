

let commands = {
	help: HelpCommand,
	spriteset: SpriteSetCommand,
	spritelist: SpriteListCommand,
	ignorechat: RemoteCommand,
	ignoregame: RemoteCommand,
	getuuid: function(args) {args.push(GetRoomID()); RemoteCommand(args); return true; },
	pardonchat: RemoteCommand,
	pardongame: RemoteCommand,
	pcm: PlayerRoomConnectionMessagesSwitchCommand,
	spritefav: SpriteFavCommand,
	spriteunfav: SpriteUnfavCommand,
	banchat: RemoteCommand,
	bangame: RemoteCommand,
	pm: RemoteCommand,
	track: TrackPlayerCommand,
	untrack: UntrackPlayerCommand
}


function ExecuteCommand(command) {
	if(command[0] == '/')
		command = command.substr(1);

	//let params = command.split(' ');

	// split string by spaces, except when they're inside quotes.
	let params = command.match(/(?:[^\s"]+|"[^"]*")+/g);
	// remove all quote characters from each part.
	for(var i in params) {
		params[i] = params[i].replace(/"/g, "");
	}
	
	if(commands[params[0]]) {
		if(!commands[params[0]](params)) {
			HelpCommand(["help", params[0]]);
		}
	} else {
		PrintChatInfo("Unknown command, use /help for help", "Commands")
	}
}

