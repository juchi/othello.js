let Game = require('./game.js');

class Server {
    constructor(httpServer) {
        this.games = {};
        this.rooms = {};
        this.waiting = {};
        this.inGameSockets = {};

        this.io = require('socket.io')(httpServer);
        this.io.on('connection', function(socket){
            server.onSocketConnection(socket);
        });
    }

    playerFromSocket(socket, name, roomId) {
        return {
            socket: socket,
            roomId: roomId || null,
            name: name
        }
    }

    startGame(roomId, players) {
        let data = {};
        data.pawns = {};
        let game = new Game(roomId);
        for (let p of players) {
            game.addPlayer(p);
            this.inGameSockets[p.socket.id] = game;
        }

        game.startNewGame();
        this.games[roomId] = game;
    }

    joinRoom(socket, roomId, playerName) {
        let player = this.playerFromSocket(socket, playerName, roomId);
        if (!server.rooms[roomId]) {
            server.rooms[roomId] = {players: []};
        }
        server.rooms[roomId].players.push(player)
        player.socket.join(roomId);
        socket.emit('set private room', roomId);
    }

    onSocketConnection(socket) {
        let server = this;
        console.log('new socket connection');

        socket.on('disconnect', function(){
            console.log('user disconnected');
            delete server.waiting[socket.id];
            if (server.inGameSockets[socket.id]) {
                server.inGameSockets[socket.id].onDisconnect(socket.id);
            }
            delete server.inGameSockets[socket.id];
        });

        socket.on('grid select', function(data) {
            let game = server.inGameSockets[socket.id];
            game && game.handleGridSelection(data.x, data.y, socket);
        });

        socket.on('ask new game', function(data) {
            let roomId = data.roomId;
            if (roomId == -1) {
                // create private match
                do {
                    roomId = (Math.random() * 90 + 10) | 0;
                } while (server.rooms[roomId]);

                server.joinRoom(socket, roomId, data.playerName);
                console.log('create private match in room ' + roomId);
            } else if (roomId) {
                // join private match
                if (!server.rooms[roomId]) {
                    // TODO handle unknown room
                    console.log('unknown room ' + roomId);
                } else if (server.canJoinRoom(server.rooms[roomId])) {
                    console.log('player join private room');
                    server.joinRoom(socket, roomId, data.playerName);

                    if (server.isRoomReady(server.rooms[roomId])) {
                        server.startGame(roomId, server.rooms[roomId].players);
                    }
                } else {
                    // TODO handle full room
                    console.log('cannot join full room ' + roomId);
                    socket.emit('private room full', roomId)
                }
            } else {
                // public match
                if (typeof server.waiting[socket.id] === 'undefined') {
                    server.waiting[socket.id] = server.playerFromSocket(socket, data ? data.playerName : null);
                }

                console.log(Object.keys(server.waiting).length + ' players in queue');
                if (Object.keys(server.waiting).length > 1) {
                    let roomId = (Math.random() * 90 + 10) | 0;
                    for (let i of Object.keys(server.waiting)) {
                        let p = server.waiting[i];
                        p.socket.join(roomId);
                        server.joinRoom(p.socket, roomId, p.name);
                        delete server.waiting[i];
                    }
                    console.log('starting a game in room ' + roomId);

                    server.startGame(roomId, server.rooms[roomId].players);
                    console.log(Object.keys(server.waiting).length + ' players in queue');
                }
            }


        });
    }

    canJoinRoom(roomInfo) {
        console.log(roomInfo);
        return roomInfo.players.length < 2;
    }
    isRoomReady(roomInfo) {
        return roomInfo.players.length == 2;
    }
}

let httpServer = require('./http.js');
let server = new Server(httpServer);
