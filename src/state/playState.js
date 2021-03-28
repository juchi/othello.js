import Game from '../game.js';
import Renderer from '../front/renderer.js';
import UI from '../front/ui.js';
import AnimatePawnsState from './animatePawnsState.js';

export default class PlayState {
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
        this.game = new Game(ui, renderer, this.gameLogic, this);
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

    enter() {

    }
    exit() {
        this.gameLogic.exit();
    }

    update(dt) {

    }

    animation(pawns, futureColor) {
        this.stack.push(new AnimatePawnsState(this.stack, pawns, futureColor));
    }

    isActive() {
        return this.stack.current() === this;
    }
}
