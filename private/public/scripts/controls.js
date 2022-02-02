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
}

let debugControls = [
	{name: "░", data_key: "Ctrl", data_key_code: "17"},
	{name: "F", data_key: "F", data_key_code: "70"},
	{name: "G", data_key: "G", data_key_code: "71"}
];

let npad;

function addControl(key) {
	let keynode = document.createElement("div");
	keynode.id = key.name + "_touch_key";
	keynode.innerText = key.name;
	keynode.dataset["key"] = key.data_key;
	keynode.dataset["keyCode"] = key.data_key_code;
	npad.appendChild(keynode);
}


function initControls() {
	npad = document.getElementById("npad")

	if(urlParams.get("test-play") === '') {
		for(let key of debugControls) {
			addControl(key);
		}
	}

	if(additionalControls[gameName]) {
		for(let key of additionalControls[gameName]) {
			addControl(key);
		}
	}

	//add chat button
	addControl({name: "💬", data_key: "Tab", data_key_code: "9"});
}

initControls();