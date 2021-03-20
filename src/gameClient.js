import io from 'socket.io-client';

export default class GameClient {
    constructor() {
        let socket = io();
        this.socket = socket;
        this.newGameMsg = null;
        this.newGameCallback = () => null;

        socket.on('new game', function (msg) {
            this.newGameMsg = msg;
            this.newGameCallback();
        }.bind(this));
        socket.on('init grid', function (msg) {
            console.log('init grid msg');
            this.game.initGrid(msg);
        }.bind(this));
        socket.on('add pawn', function (msg) {
            console.log('flip pawns msg');
            this.game.addPawn(msg);
        }.bind(this));
        socket.on('flip pawns', function (msg) {
            console.log('flip pawns msg');
            this.game.flipPawns(msg.pawns, msg.color);
        }.bind(this));
        socket.on('set current player', function (msg) {
            console.log('set current player msg', msg);
            this.game.setCurrentPlayer(msg);
        }.bind(this));
        socket.on('missing player', function (msg) {
            console.log('missing player msg', msg);
            this.game.info('missing disconnected opponent');
        }.bind(this));
        socket.on('end game', function (msg) {
            console.log('end game msg', msg);
            this.game.info('Game is finished ' + (msg == 0 ? 'black' : 'white') + ' wins');
        }.bind(this));
    }

    setGame(game) {
        this.game = game;
    }

    changePlayer(i) {
        this.game.setCurrentPlayer(i);
    }

    askStartGame(data, callback) {
        this.socket.emit('ask new game', {playerName: data.playerName});
        this.newGameCallback = callback;
    }

    startNewGame() {
        this.game.setPlayerInfo(this.newGameMsg);
    }

    handleGridSelection(x, y, currentPlayer) {
        this.socket.emit('grid select', {x: x, y: y});
    }

    disconnect() {
        this.socket.disconnect();
    }
}
