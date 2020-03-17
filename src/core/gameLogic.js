let Pawn = require('./pawn.js');
let Grid = require('./grid.js');

module.exports = class GameLogic
{
    constructor() {
        this.game = null;
        this.currentPlayerIndex = 0;
        this.grid = new Grid();
    }

    setGame(game) {
        this.game = game;
    }

    // private
    changePlayer(i) {
        if (typeof i !== 'undefined') {
            this.currentPlayerIndex = i;
        } else {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
        }
        
        this.game.setCurrentPlayer(this.currentPlayerIndex);
    }

    startNewGame() {
        this.initGrid();
        this.changePlayer(0);
    }

    // private
    initGrid() {
        this.grid.clear();
        this.setupStartPawns(this.grid);
        let data = {pawns: []};
        for (let col of this.grid.pawns) {
            if (typeof col === 'undefined') {
                continue;
            }
            for (let pawn of col) {
                if (typeof pawn === 'undefined') {
                    continue;
                }
                data.pawns.push({x: pawn.x, y: pawn.y, color: pawn.color});
            }
        }
        this.game.initGrid(data);
    }

    // private
    flipPawns(newPawn) {
        let flipList = this.grid.searchFlippablePawns(newPawn.x, newPawn.y, newPawn.color);
        flipList.map((pawn) => pawn.setColor(newPawn.color));

        let flipData = flipList.map((pawn) => { return {x: pawn.x, y: pawn.y} });
        this.game.flipPawns(flipData, newPawn.color);
    }

    // private
    setupStartPawns(grid) {
        let x = (grid.cols / 2)|0;
        let y = (grid.rows / 2)|0;
        let startPawns = [
            {x: x-1, y: y-1, color: 0},
            {x: x-1, y: y, color: 1},
            {x: x, y: y, color: 0},
            {x: x, y: y-1, color: 1}
        ];
        for (let startPawn of startPawns) {
            let pawn = new Pawn();
            pawn.setPos(startPawn.x, startPawn.y);
            pawn.setColor(startPawn.color);
            this.grid.addPawn(pawn);
        }
    }

    handleGridSelection(x, y, currentPlayer) {
        if (this.grid.isMoveAllowed(x, y, currentPlayer.color)) {
            let pawn = new Pawn();
            pawn.setPos(x, y);
            pawn.setColor(currentPlayer.color);
            this.grid.addPawn(pawn);
            this.game.addPawn({x: pawn.x, y: pawn.y, color: pawn.color});

            this.flipPawns(pawn);
            this.changePlayer();
        }
    }
}
