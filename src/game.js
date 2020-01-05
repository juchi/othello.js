import Grid from './core/grid.js';
import Pawn from './core/pawn.js';
import PawnGraphics from './front/pawnGraphics.js'

export default class Game
{
    constructor(ui, renderer, gamelogicClass) {
        this.ui = ui;
        this.ui.game = this;
        this.players = [{color: 0}, {color: 1}];
        this.currentPlayerIndex = 0;
        this.logic = new gamelogicClass();
        this.logic.setGame(this);
        this.renderer = renderer;
        this.renderer.setGame(this);
        this.playerColor = null;
    }
    
    destroy() {
        this.logic.gameClient = null;
        this.logic = null;
        this.renderer.destroy();
        this.renderer.setGame(null);
        this.renderer = null;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    setCurrentPlayer(currentPlayerIndex) {
        this.currentPlayerIndex = currentPlayerIndex;

        let currentPlayer = this.getCurrentPlayer();
        this.ui.updateCurrentPlayer(currentPlayer);
    }

    setPlayerInfo(color) {
        this.playerColor = color;
        this.ui.setPlayerInfo(color);
    }

    startNewGame() {
        this.logic.startNewGame();
    }

    initGrid(data) {
        this.grid = new Grid();
        this.renderer.initGrid(this.grid);
        this.renderer.renderGrid();

        for (let pawnData of data.pawns) {
            this.addPawn(pawnData);
        }
    }

    addPawn(pawnData) {
        let pawn = new Pawn();
        pawn.initGraphics(new PawnGraphics(this.renderer.gridGraphics.squareSize));
        pawn.setPos(pawnData.x, pawnData.y);
        pawn.setColor(pawnData.color);
        this.grid.addPawn(pawn);
        
        this.renderer.gridGraphics.container.addChild(pawn.graphics.shape);
    }

    handleGridSelection(x, y) {
        let currentPlayer = this.getCurrentPlayer();
        if (this.playerColor === null || currentPlayer.color === this.playerColor) {
            this.logic.handleGridSelection(x, y, currentPlayer);
        }
    }

    flipPawns(flipList, color) {
        this.updatePawnsColor(flipList, color);
    }

    updatePawnsColor(pawnsToUpdate, newColor) {
        for (let coords of pawnsToUpdate) {
            let pawn = this.grid.getPawn(coords.x, coords.y);
            pawn.setColor(newColor);
        }
    }
}
