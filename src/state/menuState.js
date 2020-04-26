import GameLogic from '../core/gameLogic.js';
import PlayState from './playState.js';
import WaitRemoteState from './waitRemoteState.js';

export default class MenuState {
    constructor(stack, parentContainer) {
        this.stack = stack;
        this.container = new PIXI.Container();
        this.parentContainer = parentContainer;
        this.parentContainer.addChild(this.container);

        const newGameText = new PIXI.Text('New local game');
        newGameText.x = 100;
        newGameText.y = 100;
        newGameText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        newGameText.interactive = true;
        newGameText.buttonMode = true;
        newGameText.on('pointerdown', this.newLocalGame.bind(this));

        this.container.addChild(newGameText);

        const newRemoteGameText = new PIXI.Text('New remote game');
        newRemoteGameText.x = 100;
        newRemoteGameText.y = 200;
        newRemoteGameText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        newRemoteGameText.interactive = true;
        newRemoteGameText.buttonMode = true;
        newRemoteGameText.on('pointerdown', this.newRemoteGame.bind(this));

        this.container.addChild(newRemoteGameText);
    }

    newLocalGame() {
        this.stack.push(new PlayState(this.stack, this.parentContainer, new GameLogic()));
    }
    newRemoteGame() {
        this.stack.push(new WaitRemoteState(this.stack, this.parentContainer));
    }

    destroy() {
        this.container.destroy(true);
    }

    onKeydown(e) {

    }

    enter() {
        this.container.visible = true;
    }
    exit() {
        this.container.visible = false;
    }

    update (dt) {

    }
}
