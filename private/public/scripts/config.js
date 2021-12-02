
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
    	}
	} catch(e) {
		PrintChatInfo("Something went wrong when loading your saved configurations. Your configs will be overwritten.");
		PrintChatInfo("Your old configs: " + window.localStorage.getItem('config'));
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
  
  loadOrInitConfig();