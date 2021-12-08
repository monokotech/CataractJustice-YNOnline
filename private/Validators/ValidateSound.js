const fs = require('fs');

function SoundValidator (gameName) {
const soundsDir =  config.gamesPath + "/" + gameName + '/Sound/';
	let soundFileList = [];

	try {
    	soundFileList = fs.readdirSync(soundsDir);
	for(let i = 0; i < soundFileList.length; i++)
		soundFileList[i] = soundFileList[i].split('.')[0];
	} catch (err) {
   		console.log(err);
	}

	this.isValidSoundFile = function(sound) {
		return soundFileList.includes(sound);
	}

}

module.exports = SoundValidator;