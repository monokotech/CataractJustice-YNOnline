const fs = require('fs');

function SpriteValidator(gameName) {
	const spritesDir = config.gamesPath + "/" + gameName + '/CharSet/';
	let spriteSheetList;

	try {
    	spriteSheetList = fs.readdirSync(spritesDir);
		for(let i = 0; i < spriteSheetList.length; i++)
			spriteSheetList[i] = spriteSheetList[i].split('.')[0];
	} catch (err) {
   		console.log(err);
	}

	this.isValidSpriteSheet = function(sheet) {
		return spriteSheetList.includes(sheet);
	}
}

module.exports = SpriteValidator;