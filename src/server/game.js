let GameLogic = require('../core/gameLogic.js');

module.exports = class Game
{
    constructor(roomId) {
        this.logic = new GameLogic();
        this.logic.setGame(this);
        this.players = [];
        this.roomId = roomId;
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
        let playerData = [];
        for (let p of this.players) {
            playerData.push({
                name: p.name,
                color: p.color,
                id: p.socket.id
            });
        }

        for (let p of this.players) {
            p.socket.emit('new game', {color: p.color, players: playerData});
        }
        this.logic.startNewGame();
    }

    endGame() {
        let winner = this.logic.getWinner();
        for (let p of this.players) {
            p.socket.emit('end game', winner);
        }
    }

    onDisconnect(socketId) {
        for (let p of this.players) {
            if (p.socket.id == socketId) {
                this.broadcast('missing player');
                break;
            }
        }
    }

    broadcast(msg, data) {
        for (let p of this.players) {
            p.socket.emit(msg, data);
        }
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
        let flipData = flipList.map((pawn) => { return {x: pawn.x, y: pawn.y} });
        for (let p of this.players) {
            p.socket.emit('flip pawns', {pawns: flipData, color: color});
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
