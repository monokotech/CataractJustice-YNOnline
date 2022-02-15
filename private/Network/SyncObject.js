const crypto = require('crypto');
const { setDefaultResultOrder } = require('dns');

let lastid = 0;

function SyncObject() {
	this.uid = (lastid++).toString();
	this.pos = {x: 0, y: 0};
	this.sprite = config.defauldSprite;
	this.sound = {};
	this.name = config.defaultName;
	this.movementAnimationSpeed = 4;
	this.facing = 0;
	this.typingstatus = 0;
	this.flash = [0, 0, 0, 0, 0];
	this.flashpause = false;
	this.system = "";

	let self = this;

	this.syncData = {type: "objectSync", uid: this.uid, pos: this.pos};

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

	this.SetVariable = function(args) {
		self.variable = args;
		self.syncData.variable = args;
	}

	this.SetSwitch = function(args) {
		self.switchsync = args;
		self.syncData.switchsync = args;
	}

	this.SetAnimFrame = function(args) {
		self.animframe = args.frame;
		self.syncData.animframe = args.frame;
	}

	this.SetFacing = function(args) {
		self.facing = args.facing;
		self.syncData.facing = args.facing;
	}

	this.SetTypingStatus = function(args) {
		self.typingstatus = args.typingstatus;
		self.syncData.typingstatus = args.typingstatus;
	}

	this.SetFlash = function(args) {
		self.flash = args.flash;
		self.syncData.flash = args.flash;
	}

	this.SetFlashPause = function (args) {
		self.flashpause = args.flashpause;
		self.syncData.flashpause = args.flashpause;
	}

	this.MoveNpc = function(args) {
		self.syncData.npcmove = args;
	}

	this.SetSystem = function(args) {
		self.system = args.system;
		self.syncData.system = args.system;
	}

	//returns everything you need to sync player on room entering
	this.GetFullSyncData = function() {
		let packet = { 
			type: "objectSync", 
			uid: self.uid, 
			pos: self.pos, 
			sprite: self.sprite, 
			name: self.name, 
			movementAnimationSpeed: self.movementAnimationSpeed, 
			facing: self.facing,
			flashpause: self.flashpause,
			system: self.system
			};

		if (self.flashpause) {
			packet.flash = self.flash;
		}

		return packet;
	}
}

module.exports = SyncObject;