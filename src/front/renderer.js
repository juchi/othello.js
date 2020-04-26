import GridGraphics from './gridGraphics.js';

export default class Renderer
{
    constructor(container) {
        this.game = null;
        this.container = container;
        this.gridGraphics = null;
        this.gridContainer = null;
    }

    destroy() {
        this.gridContainer.destroy(true);
    }

    setGame(game) {
        this.game = game;
    }

    initGrid(grid) {
        this.gridContainer = new PIXI.Container();
        this.gridContainer.x = 10;
        this.gridContainer.y = 10;
        this.gridGraphics = new GridGraphics(this.gridContainer, this);
        this.gridGraphics.init(grid);

        this.container.addChild(this.gridContainer);
    }
    
    renderGrid() {
        this.gridGraphics.render();
    }

    handleGridSelection(x, y) {
        this.game.handleGridSelection(x, y);
    }
}
