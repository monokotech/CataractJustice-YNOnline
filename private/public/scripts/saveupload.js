let wantUploadSaveButton = document.getElementById("wantUploadSaveButton");
let uploadSaveButton = document.getElementById("uploadSaveButton");
let uploadSaveContainet = document.getElementById("uploadSaveContainer");
let uploadSaveFileInput = document.getElementById("uploadSaveFileInput");
let uploadSaveSlotInput = document.getElementById("uploadSaveSlotInput");

wantUploadSaveButton.onclick = function() {
	uploadSaveContainet.style.display = "block";
	wantUploadSaveButton.style.display = "none";
}

uploadSaveButton.onclick = async function() {
	uploadSaveContainet.style.display = "none";
	wantUploadSaveButton.style.display = "block";
	console.log(uploadSaveFileInput.files);
	let saveFileBuffer = await uploadSaveFileInput.files[0].arrayBuffer();

	FS.syncfs(true, function() {
  		FS.writeFile("Save/Save" + uploadSaveSlotInput.value + ".lsd", new Uint8Array(saveFileBuffer));
 		FS.syncfs(false, function() {});
	});
}