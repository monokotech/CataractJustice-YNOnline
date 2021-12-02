const fs = require('fs');
const soundsDir = './public/play/gamesdefault/Sound/';

let soundFileList = [];

try {
    soundFileList = fs.readdirSync(soundsDir);
	for(let i = 0; i < soundFileList.length; i++)
		soundFileList[i] = soundFileList[i].split('.')[0];
} catch (err) {
    console.log(err);
}

function isValidSoundFile(sound) {
	return soundFileList.includes(sound);
}

module.exports = isValidSoundFile;