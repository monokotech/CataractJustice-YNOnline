const fs = require('fs');

function SystemValidator(gameName) {
	const systemsDir = config.gamesPath + "/" + gameName + '/System/';
	let systemsList;
	if(config.gamesList.includes(gameName)) {
	try {
    	systemsList = fs.readdirSync(systemsDir);
		for(let i = 0; i < systemsList.length; i++)
			systemsList[i] = systemsList[i].split('.')[0];
	} catch (err) {
   		console.log(err);
	}
	}

	this.isValidSystem = function(sheet) {
		return systemList.includes(sheet);
	}
}

module.exports = SystemValidator;