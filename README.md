# YNOnline

Yume Nikki browser multiplayer

# Game Server Setup
### Set your WebSocket port
go into ./private/
open configuration.js
edit 'port' field of global.config object
### Start your game server
Use 'node YNOnline.js' to start game server

#Client setup
### Set your WebSocket url
go into ./public/
open ynonline.js
edit 'WSAddress'
### Host client
Host client using any http/(https?) server
