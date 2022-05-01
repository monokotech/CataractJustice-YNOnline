
function TrackPlayerCommand(args) {
	console.log(args);
	if(args.length == 2) {
		let nameptr = Module.allocate(Module.intArrayFromString(args[1]), Module.ALLOC_NORMAL);
		Module._TrackCommand(nameptr);
		Module._free(nameptr);
		PrintChatInfo("Tracking player " + args[1], "Track");
		return true;
	}
	return false;
}

function UntrackPlayerCommand(args) {
	if(args.length == 2) {
		let nameptr = Module.allocate(Module.intArrayFromString(args[1]), Module.ALLOC_NORMAL);
		Module._UntrackCommand(nameptr);
		Module._free(nameptr);
		PrintChatInfo("Stopped tracking player " + args[1], "Untrack");
		return true;
	}
	return false;
}