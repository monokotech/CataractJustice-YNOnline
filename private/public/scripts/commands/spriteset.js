
let spriteSheetList = {
	nikki:[
	"000000000054",
	"000000000053",
	"0000000000000000000029",
	"0000000000000000000030",
	"0000000000000000000031",
	"000001",
	"00002",
	"00003",
	"00004",
	"00005",
	"00006",
	"00007",
	"00008",
	"00009",
	"00010",
	"00000011",
	"00000012",
	"0000013",
	"0000014",
	"0000015",
	"000000000000000016",
	"000000000000000017",
	"0000000000000018",
	"0000000000000019",
	"0000000000000020",
	"0000000000000021",
	"00000000000000022",
	"00000000000000023",
	"00000000000000024",
	"00000000000000025",
	"00000000000000026",
	"00000000000000027",
	"00000000000000028",
	"000000000032",
	"000000000033",
	"000000000034",
	"000000000035",
	"000000000036",
	"000000000037",
	"000000000038",
	"000000000039",
	"000000000040",
	"000000000041",
	"000000000042",
	"000000000043",
	"000000000044",
	"000000000045",
	"000000000046",
	"000000000047",
	"000000000048",
	"000000000049",
	"000000000050",
	"000000000051",
	"000000000052",
	"000000000053",
	"000000000054",
	"000000000055",
	"000000000056",
	"000000000057",
	"000000000058",
	"000000000059",
	"000000000060",
	"000000000061",
	"000000000062",
	"000000000063",
	"000000000064",
	"0000000078",
	"0000000079",
	"0000000080",
	"0000000081",
	"0000000082",
	"0000000083",
	"0000000084",
	"0000000000000095",
	"0000000000000096",
	"0000000000000097"
]
};

let spriteList = { 
	nikki: {
		monoe: {sheet: "000000000054", id: 0},
		monoko: {sheet: "000000000053", id: 3},
		boombox: {sheet: "000000000047", id: 0},
		tv: {sheet: "000000000054", id: 5},
		poniko: {sheet: "000000000056", id: 4},
		uboa: {sheet: "000000000056", id: 5},
		masada: {sheet: "000000000056", id: 6}
	}
}

function SpriteListCommand(args) {
	if(!spriteList[gameName])
		return;
	let liststr = "";
	let keys = Object.keys(spriteList[gameName]);
	liststr += "default\n";
	for(let k of keys) {
		liststr += k + "\n";
	}

	PrintChatInfo(liststr, "SpriteList");
	return true;
}

function SpriteSetCommand(args) {
	if(args.length == 2) {
		if(!spriteList[gameName])
			return;
		let sprite = spriteList[gameName][args[1]];
		if(args[1] == "default")
			sprite = {sheet: "", id: 0};
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
			let valid = !spriteList[gameName] || spriteSheetList[gameName].length == 0;
			if(!valid)
				valid = spriteSheetList[gameName].includes(args[1]);
			if(valid) {	
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
