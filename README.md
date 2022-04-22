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

