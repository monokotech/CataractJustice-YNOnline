
let spriteSheetList = [
	"000000000054",
	"000000000053",
	"l_001"
];

let spriteList = {
	monoe: {sheet: "000000000054", id: 0},
	monoko: {sheet: "000000000053", id: 4}
}

function SpriteListCommand(args) {
	let liststr = "";
	let keys = Object.keys(spriteList);

	for(let k of keys) {
		liststr += k + "\n";
	}

	PrintChatInfo(liststr, "SpriteList");
	return true;
}

function SpriteSetCommand(args) {
	if(args.length == 2) {
		let sprite = spriteList[args[1]];
		if(sprite) {

			sheet = Module.allocate(Module.intArrayFromString(sprite.sheet), Module.ALLOC_NORMAL);
  			Module._SlashCommandSetSprite(sheet, sprite.id);
  			Module._free(sheet);

			
		} else {
			PrintChatInfo("Unknown sprite name, see /spritelist", "SpriteSet");
		}
	} else if (args.length == 3) {
		let id = parseInt(args[2]);

		if(!isNaN(id) || id < 0 || id > 7) {
			if(spriteSheetList.includes(args[1])) {
				
				sheet = Module.allocate(Module.intArrayFromString(args[1]), Module.ALLOC_NORMAL);
  				Module._SlashCommandSetSprite(sheet, id);
  				Module._free(sheet);

			} else {
				PrintChatInfo("Unknown sprite sheet", "SpriteSet");
			}
		} else {
			PrintChatInfo("Invalid id, id has to be a number from 0 to 7", "SpriteSet");
		}
	} else {
		return false;
	}
	return true;
}
