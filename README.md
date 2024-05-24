# Repository Status

Executed the following command to rewrite the repository:

```
git filter-repo --force --invert-paths \
	--path "node_modules" \
	--path "public/play" \
	--path "private/public/play" \
	--path "private/public/index.wasm" \
	--path "private/public/index.js" \
	--path "private/node_modules" \
	--path "public/favicon.ico" \
	--path "private/public/favicon.ico" \
	--path "public/styles/fonts" \
	--path "private/public/styles/fonts" \
	--path "public/styles/images" \
	--path "private/public/styles/images"
```

Repository directory structure:
```
[ 102]  .
├── [1.0K]  LICENSE
├── [ 212]  private
│   ├── [1.6K]  ClientsStorage.js
│   ├── [ 776]  configuration.js
│   ├── [ 260]  Network
│   │   ├── [3.2K]  ChatRoom.js
│   │   ├── [ 858]  ChatServer.js
│   │   ├── [  78]  Commands
│   │   │   ├── [1.4K]  Commands.js
│   │   │   ├── [1.9K]  Ignores.js
│   │   │   └── [ 758]  PersonalMessage.js
│   │   ├── [2.1K]  ConnectionManager.js
│   │   ├── [ 105]  EventObject.js
│   │   ├── [2.4K]  GameServer.js
│   │   ├── [ 275]  RequestUtils.js
│   │   ├── [ 11K]  Room.js
│   │   ├── [ 357]  ServerListing.js
│   │   └── [2.8K]  SyncObject.js
│   ├── [ 150]  package.json
│   ├── [ 34K]  package-lock.json
│   ├── [  46]  public
│   │   ├── [7.3K]  index.html
│   │   ├── [ 298]  scripts
│   │   │   ├── [ 14K]  chat.js
│   │   │   ├── [ 324]  commands
│   │   │   │   ├── [ 344]  animations.js
│   │   │   │   ├── [1.1K]  commands.js
│   │   │   │   ├── [ 290]  connectioninfo.js
│   │   │   │   ├── [ 305]  getuuid.js
│   │   │   │   ├── [2.2K]  helpcommand.js
│   │   │   │   ├── [ 402]  ignore.js
│   │   │   │   ├── [ 402]  pardon.js
│   │   │   │   ├── [ 299]  playerroomconnections.js
│   │   │   │   ├── [ 201]  pvol.js
│   │   │   │   ├── [ 126]  remotecommand.js
│   │   │   │   ├── [ 800]  spritefav.js
│   │   │   │   ├── [ 11K]  spriteset.js
│   │   │   │   └── [ 633]  track.js
│   │   │   ├── [1.5K]  config.js
│   │   │   ├── [3.4K]  controls.js
│   │   │   ├── [4.1K]  erpg.js
│   │   │   ├── [  52]  gameapi.js
│   │   │   ├── [ 137]  ingameapi.js
│   │   │   ├── [ 269]  onRuntimeInitialized.js
│   │   │   ├── [ 875]  savedownload.js
│   │   │   ├── [ 935]  saveupload.js
│   │   │   ├── [ 401]  switchsync.js
│   │   │   └── [ 542]  ynonline.js
│   │   └── [  50]  styles
│   │       ├── [2.0K]  chat.css
│   │       ├── [2.8K]  erpg.css
│   │       └── [1.7K]  style.css
│   ├── [ 166]  Validators
│   │   ├── [ 133]  ValidateName.js
│   │   ├── [ 551]  ValidateSound.js
│   │   ├── [ 537]  ValidateSpriteSheet.js
│   │   ├── [ 507]  ValidateSystem.js
│   │   └── [  81]  Validators.js
│   └── [1.2K]  YNOnline.js
└── [1.6K]  README.md

9 directories, 52 files
```

862M -> 3.0M

Original: https://gitlab.com/CataractJustice/YNOnline

# YNOnline

Server for EasyRPG online client 

Client source code: https://github.com/CataractJustice/ynoclient/

## Features

```
-Support for every feature added to the client
-Support for several game "servers" running on a single server
-Support for limiting amout of connections for a single ip
-Support for http and https
-Togglabe ping system
-Web page for easyrpg online client
-Web chat client.
-Ability to ignore players in game and/or in chat
-Operator commands (such as banchat, bangame)
-"Uploading" and "Downloading" easyrpg save files. (all saves are stored on client side locally in browsers db)
```


# Game Server Setup
## Set your WebSocket port
```
Go into private/ 
Open configuration.js
Edit 'port' field of global.config object
Set 'https' to 'true' if you want to use https
Set key and cert paths (for https)
Put you games to private/public/play/games/ folder
Run gencache in game folders (can be found here https://easyrpg.org/player/guide/webplayer/)
```
## Start your game server
```
Use 'node YNOnline.js' to start game server
```

# Client setup

## Set your WebSocket url
```
Go into public/scripts/
Open ynonline.js
Edit 'WSAddress' to be the server you want your client to connect to
```

