let additionalControls = {
	nikki: [
		{name: "1", data_key: "Num1", data_key_code: "49"},
		{name: "3", data_key: "Num3", data_key_code: "51"},
		{name: "5", data_key: "Num5", data_key_code: "53"},
		{name: "9", data_key: "Num9", data_key_code: "57"}
	],
	"2kki": [
		//shift
		{name: "↑", data_key: "Shift", data_key_code: "16"}
	]
};

let possibleKeys = [
	{name: "1", data_key: "Num1", data_key_code: "49"},
	{name: "2", data_key: "Num2", data_key_code: "50"},
	{name: "3", data_key: "Num3", data_key_code: "51"},
	{name: "4", data_key: "Num4", data_key_code: "52"},
	{name: "5", data_key: "Num5", data_key_code: "53"},
	{name: "6", data_key: "Num6", data_key_code: "54"},
	{name: "7", data_key: "Num7", data_key_code: "55"},
	{name: "8", data_key: "Num8", data_key_code: "56"},
	{name: "9", data_key: "Num9", data_key_code: "57"},
	{name: "↑", data_key: "Shift", data_key_code: "16"},
	{name: "💬", data_key: "Tab/Chat", data_key_code: "9"}
];

let debugControls = [
	{name: "░", data_key: "Ctrl", data_key_code: "17"},
	{name: "F", data_key: "F", data_key_code: "70"},
	{name: "G", data_key: "G", data_key_code: "71"}
];

let npad;
let controlsMenu;

function addControl(key) {
	let keynode = document.createElement("div");
	keynode.id = key.name + "_touch_key";
	keynode.innerText = key.name;
	keynode.dataset["key"] = key.data_key;
	keynode.dataset["keyCode"] = key.data_key_code;
	npad.appendChild(keynode);
}

function getControlNode(key) {
	let keynode = document.getElementById(key.name + "_touch_key");
	return keynode;
}

function removeControl(key) {
	npad.removeChild(getControlNode(key));
}

function saveControls() {
	let gameControls = [];
	for(key of possibleKeys) {
		if(getControlNode(key)) {
			gameControls.push(key);
		}
	}
	window.localStorage[gameName + "controls"] = JSON.stringify(gameControls);
}

function switchControl(key) {
	if(getControlNode(key)) {
		removeControl(key);
		return false;
	} else {
		addControl(key);
		return true;
	}
}



function initControls() {
	npad = document.getElementById("npad")
	mobileControlsMenu = document.getElementById("mobileControlsMenu");

	if(urlParams.get("test-play") === '') {
		for(let key of debugControls) {
			addControl(key);
		}
	}

	let savedControls;
	try {
		savedControls = JSON.parse(window.localStorage[gameName + "controls"]);
	} catch {}
	let gameControls = savedControls ? savedControls : additionalControls[gameName];
	if(gameControls) {
		for(let key of gameControls) {
			addControl(key);
		}
	}

	//add chat button
	if(!savedControls) {
		addControl({name: "💬", data_key: "Tab/Chat", data_key_code: "9"});
	}

	let cancelNode = document.createElement("div");
	cancelNode.className = "mobileControlsOption";
	cancelNode.innerText = "Cancel";
	cancelNode.onclick = function() {
		mobileControlsMenu.style.display = "none";
	}
	mobileControlsMenu.appendChild(cancelNode);

	for(let option of possibleKeys) {
		let optionNode = document.createElement("div");
		optionNode.className = "mobileControlsOption";
		optionNode.innerText = option.data_key;
		optionNode.style.backgroundColor = getControlNode(option) ? "#505050" : "#303030";
		optionNode.onclick = function() {
			optionNode.style.backgroundColor = switchControl(option) ? "#505050" : "#303030";;
			mobileControlsMenu.style.display = "none";
			saveControls();
		}
		mobileControlsMenu.appendChild(optionNode);
	}
}

initControls();