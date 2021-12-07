const fs = require('fs');
const spritesDir = config.gamePath + '/CharSet/';

let spriteSheetList;

try {
    spriteSheetList = fs.readdirSync(spritesDir);
	for(let i = 0; i < spriteSheetList.length; i++)
		spriteSheetList[i] = spriteSheetList[i].split('.')[0];
} catch (err) {
    console.log(err);
}

function isValidSpriteSheet(sheet) {
	return spriteSheetList.includes(sheet);
}

module.exports = isValidSpriteSheet;