let Game = require('./game.js');

class Server {
    constructor(httpServer) {
        this.games = {};
        this.waiting = {};
        this.inGameSockets = {};

        this.io = require('socket.io')(httpServer);
        this.io.on('connection', function(socket){
            server.onSocketConnection(socket);
        });
    }

    playerFromSocket(socket, name) {
        return {
            socket: socket,
            roomId: null,
            name: name
        }
    }

    startGame(roomId) {
        let players = [];
        for (let i of Object.keys(this.waiting)) {
            players.push(this.waiting[i]);
            delete this.waiting[i];
        }

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
            if (typeof server.waiting[socket.id] === 'undefined') {
                server.waiting[socket.id] = server.playerFromSocket(socket, data ? data.playerName : null);
            }

            console.log(Object.keys(server.waiting).length + ' players in queue');
            if (Object.keys(server.waiting).length > 1) {
                let roomId = (Math.random() * 90 + 10) | 0;
                for (let i of Object.keys(server.waiting)) {
                    let p = server.waiting[i];
                    p.socket.join(roomId);
                    p.roomId = roomId;
                }
                console.log('starting a game in room ' + roomId);
                server.startGame(server.waiting);
                console.log(Object.keys(server.waiting).length + ' players in queue');
            }
        });
    }
}

let httpServer = require('./http.js');
let server = new Server(httpServer);
