import Game from '../game.js';
import GameClient from '../gameClient.js';
import GameLogic from '../core/gameLogic.js';
import Renderer from '../front/renderer.js';
import UI from '../front/ui.js';

export default class GameState {
    constructor(stack, container, gameLogic) {
        this.stack = stack;
        this.container = container;
        this.gameLogic = gameLogic;
        this.init();
    }

    init() {
        let ui = new UI(this.container);
        this.ui = ui;
        ui.setup();
        
        let renderer = new Renderer(this.container);
        this.game = new Game(ui, renderer, this.gameLogic);
        this.game.startNewGame();
    }

    onKeydown(e) {
        if (e.keyCode === 65) {
            this.game.startNewGame();
        } else if (e.keyCode === 27) {
            this.stack.pop();
        }
    }

    destroy() {
        this.game.destroy();
        this.ui.destroy();
    }
}
