ENV.SDL_EMSCRIPTEN_KEYBOARD_ELEMENT = "#canvas";
Module['onRuntimeInitialized'] = initChat;

let chatMessagesContainer = document.getElementById("messages");
let chatInputContainer = document.getElementById("chatInputContainer");
let enterChatForm = document.getElementById('enterChatForm');
let nameInput = document.getElementById('nameInput');
let tripInput = document.getElementById('tripInput');
let chatInput = document.getElementById("chatInput")

let profilepacket;

let globalMessagesToggle = document.getElementById("globalMessagesToggle");
let globalChatDisplayed = true;

globalMessagesToggle.onclick = function(){
	globalChatDisplayed = !globalChatDisplayed;
	document.querySelector(':root').style.setProperty('--global-chat-display', globalChatDisplayed ? 'block' : 'none');
}

function SendMessage() {
  if (chatInput.value === "") {
    return;
  }

  if(chatInput.value[0] == '/') {
	  ExecuteCommand(chatInput.value);
	  chatInput.value = "";
	  return;
  }

  if(chatInput.value[0] == '!') {
  	chatInput.value = chatInput.value.substr(1);
	YNOnline.Network.globalChat.SendMessage(JSON.stringify({text: chatInput.value}));
  } else if(YNOnline.Network.localChat){
	YNOnline.Network.localChat.SendMessage(JSON.stringify({text: chatInput.value}));
  } else {
	  PrintChatInfo("You're not connected to any room\nYou can use global chat with '!' at the begining of a message", "Client");
  }
  chatInput.value = "";
}

function NewChatMessage(message, source) {
	let messageContainer = document.createElement("div");
	let messageTextContainer = document.createElement("div");
	let messageProfileContainer = document.createElement("div");
	let messageProfileNameContainer = document.createElement("div");
	let messageProfileTripContainer = document.createElement("div");
	let messageProfileSourceContainer = document.createElement("div");
	messageContainer.classList.add("MessageContainer", source);
	messageTextContainer.className = "MessageTextContainer";
	messageProfileContainer.className = "MessageProfileContainer";
	messageProfileNameContainer.className = "MessageProfileNameContainer";
	messageProfileTripContainer.className = "MessageProfileTripContainer";
	messageProfileSourceContainer.className = "MessageProfileSourceContainer";
	
	messageProfileNameContainer.innerText = message.name;
	messageProfileTripContainer.innerText = message.trip;
	messageProfileSourceContainer.innerText = source;
	messageTextContainer.innerText = message.text;

	messageProfileContainer.append(messageProfileSourceContainer);
	messageProfileContainer.append(messageProfileNameContainer);
	messageProfileContainer.append(messageProfileTripContainer);
	messageContainer.append(messageProfileContainer);
	messageContainer.appendChild(messageTextContainer);
	chatMessagesContainer.appendChild(messageContainer);
	onNewChatEntry();
}

function PrintChatInfo(text, source) {
	let infoContainer = document.createElement("div");
	let infoTextContainer = document.createElement("div");
	let infoSourceContainer = document.createElement("div");
	infoContainer.className = "InfoContainer";
	infoSourceContainer.className = "InfoSourceContainer";
	infoTextContainer.className = "InfoTextContainer";
	infoTextContainer.innerText = text;
	infoSourceContainer.innerText = source + ":";
	infoContainer.appendChild(infoSourceContainer);
	infoContainer.appendChild(infoTextContainer);
	chatMessagesContainer.appendChild(infoContainer);
	onNewChatEntry();
}

function onNewChatEntry() {
	let shouldScroll = (chatMessagesContainer.scrollHeight - chatMessagesContainer.scrollTop - chatMessagesContainer.clientHeight) <= 100;
	if(shouldScroll) {
		chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
	}
}

function Chat (address, chatname, isglobal) 
{
	let preConnectionMessageQueue = [];
	let socket = new WebSocket(address);
	let chatType = "L";
	this.isglobal = isglobal;
	let self = this;

	if(isglobal)
		chatType = "G";
	
	socket.onopen = function(e) {
		socket.send(gameName + "chat");
		socket.send(chatname);

		for(m of preConnectionMessageQueue) {
			socket.send(m);
		}

		delete preConnectionMessageQueue;
	}

	socket.onmessage = function(e) {
		let data = JSON.parse(e.data);
		switch(data.type) {
		case "userMessage":
			NewChatMessage(data, chatType);
		break;
		case "userConnect":
		if(self.isglobal)
			PrintChatInfo(" " + data.name + " joined chat.", "Server");
		else
			PrintChatInfo(" " + data.name + " joined this room.", "Server");
		break;
		case "roomDisconnect":
		if(self.isglobal)
			PrintChatInfo(" " + data.name + " left.", "Server");
		else
			PrintChatInfo(" " + data.name + " left this room.", "Server");
		break;
		case "serverInfo":
			PrintChatInfo(data.text, "Server")
		break;
		case "ping":
			self.SendMessage("{ \"type\": \"pong\" }");
		break;
		}
	}

	this.SendMessage = function(message) {
		if(socket.readyState === WebSocket.CONNECTING) {
			preConnectionMessageQueue.push(message);
		} else {
			socket.send(message);
		}
	}

	this.Close = function() {
		socket.close();
	}
}

function randomTripcode(len) {
	let t = "";
	let c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSUVWXYZ0123456789";
	for(let i = 0; i < len; i++)
		t += c[parseInt(Math.random() * c.length)];
	return t;
}

//TO-DO: rename to something more neutral (SendProfileInfo() or smth) just in case anything is going to change
function SendNameAndTripcode() {
	
	if(nameInput.value === "")
		return;

	if(tripInput.value === "") {
		tripInput.value = randomTripcode(16);
	}

	document.getElementById("enterChatContainer").style.display = "none";
	chatInputContainer.style.display = "block";
	chatInput.disabled = false;

	let data = {name: nameInput.value, trip: tripInput.value}
	profilepacket = JSON.stringify(data);
	YNOnline.Network.globalChat.SendMessage(profilepacket);

	saveChatConfig();

	let name = Module.allocate(Module.intArrayFromString(nameInput.value), Module.ALLOC_NORMAL);
  	Module._ChangeName(name);
	Module._free(name);

	nameInput.value = "";
	tripInput.value = "";

	ConnectToLocalChat(GetRoomID());
}

function ConnectToLocalChat(room) {
	if(YNOnline.Network.localChat)
		YNOnline.Network.localChat.Close();
	YNOnline.Network.localChat = new Chat(WSAddress, "chat"+room);
	if(profilepacket)
		YNOnline.Network.localChat.SendMessage(profilepacket);
}

YNOnline.Network.globalChat = new Chat(WSAddress, "gchat", true);
YNOnline.Network.localChat = null;

function initChat() {
  let host = Module.allocate(Module.intArrayFromString(WSAddress), Module.ALLOC_NORMAL);
	Module._SetWSHost(host);
	Module._free(host);

	PrintChatInfo("Type /help to see list of slash commands.\nUse '!' at the bebining of a message to send it to global chat.", "Info");
}

window.onresize = function(event) {
    if(document.documentElement.clientWidth < 1190) {
		document.getElementById("chatboxContainer").style.width = "100%";
		document.getElementById("game_container").style.width = "100%";
		document.getElementById("game_container").style.maxWidth = "100%";
	} else {
		document.getElementById("chatboxContainer").style.width = "calc(100% - 71%)";
		document.getElementById("game_container").style.width = "100%";
		document.getElementById("game_container").style.maxWidth = "70%";
	}
};

window.onresize();