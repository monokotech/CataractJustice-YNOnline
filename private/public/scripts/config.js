
let config = {
	chat: {
    	name: '',
		trip: ''
	}
  };

  
  function saveChatConfig () {
    config.chat.name = nameInput.value;
	config.chat.trip = tripInput.value;
    updateConfig(config);
  };
  
  function loadOrInitConfig() {
	let savedConfig;
	let configjson;
	try {
		configjson = JSON.stringify(config);
		if (!window.localStorage.hasOwnProperty('config')) {
    		window.localStorage.setItem('config', configjson);
		}
    	else {
    		savedConfig = JSON.parse(window.localStorage.getItem('config'));
				nameInput.value = savedConfig.chat.name;
				tripInput.value = savedConfig.chat.trip;
				// let game know about saved config
				let inCfgName = Module.allocate(Module.intArrayFromString(savedConfig.chat.name), Module.ALLOC_NORMAL);
				let inCfgTrip = Module.allocate(Module.intArrayFromString(savedConfig.chat.trip), Module.ALLOC_NORMAL);
			  Module._loadProfileSavedPreferences(inCfgName, inCfgTrip);
				Module._free(inCfgName);
				Module._free(inCfgTrip);
    	}
	} catch(e) {
		console.error(e);
		console.log("Something went wrong when loading your saved configurations. Your configs will be overwritten.");
		console.log("Your old configs: " + window.localStorage.getItem('config'));
    	window.localStorage.setItem('config', configjson);
		console.log(e);
	}
	
	config = savedConfig;
  }
  
  function updateConfig(config) {
    try {
      window.localStorage.config = JSON.stringify(config);
    } catch (error) {
		PrintChatInfo("Something went wrong when saving your configurations.")
    }
  }