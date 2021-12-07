const crypto = require('crypto');

function SyncObject() {
	let self = this;
	this.uid = crypto.randomUUID();
	this.pos = {x: 0, y: 0};
	this.sprite = {sheet: "000000000054", id: 0};
	this.sound = config.defauldSprite;
	this.name = config.defaultName;
	this.movementAnimationSpeed = 2;

	this.syncData = {type: "objectSync", uid: this.uid, pos: this.pos, name: this.name};

	this.SetPosition = function(args) {
		self.pos.x = args.x;
		self.pos.y = args.y;
		self.syncData.pos = self.pos;
	}

	this.SetSprite = function(args) {
		self.sprite = args;
		self.syncData.sprite = args;
	}

	this.GetSyncData = function() {
		return self.syncData;
	}

	this.ClearSyncData = function() {
		self.syncData = {type: "objectSync", uid: self.uid};
	}

	this.PlaySound = function (args) {
		self.sound = args;
		self.syncData.sound = args;
	}

	this.SetWeather = function(args) {
		self.weather = args;
		self.syncData.weather = args;
	}

	this.SetName = function(args) {
		self.name = args.name;
		self.syncData.name = args.name;
	}

	this.SetMovementSpeed = function(args) {
		self.movementAnimationSpeed = args.movementAnimationSpeed;
		self.syncData.movementAnimationSpeed = args.movementAnimationSpeed;
	}

	this.GetFullSyncData = function() {
		return { type: "objectSync", uid: self.uid, pos: self.pos, sprite: self.sprite, name: self.name, movementAnimationSpeed: self.movementAnimationSpeed};
	}
}

module.exports = SyncObject;