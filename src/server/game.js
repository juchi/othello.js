let GameLogic = require('../core/gameLogic.js');

module.exports = class Game
{
    constructor() {
        this.logic = new GameLogic();
        this.logic.setGame(this);
        this.players = [];
    }
    
    destroy() {
        this.logic.gameClient = null;
        this.logic = null;
        this.players = [];
    }

    addPlayer(player) {
        player.color = this.players.length;
        this.players.push(player);
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    setCurrentPlayer(currentPlayerIndex) {
        this.currentPlayerIndex = currentPlayerIndex;
        for (let p of this.players) {
            p.socket.emit('set current player', currentPlayerIndex);
        }
    }

    startNewGame() {
        for (let p of this.players) {
            p.socket.emit('new game', p.color);
        }
        this.logic.startNewGame();
    }

    initGrid(data) {
        for (let p of this.players) {
            p.socket.emit('init grid', data);
        }
    }

    addPawn(pawnData) {
        for (let p of this.players) {
            p.socket.emit('add pawn', pawnData);
        }
    }

    flipPawns(flipList, color) {
        for (let p of this.players) {
            p.socket.emit('flip pawns', {pawns: flipList, color: color});
        }
    }

    handleGridSelection(x, y, socket) {
        let currentPlayer = this.getCurrentPlayer();
        if (currentPlayer.socket.id !== socket.id) {
            console.log('player selection refused - not active');
            return;
        }

        this.logic.handleGridSelection(x, y, currentPlayer);
    }
}
