import { Graphics } from 'pixi.js';
import GameClient from '../gameClient.js';
import PlayState from './playState.js';

export default class WaitRemoteState {
    constructor(stack, parentContainer) {
        this.timer = 0;
        this.parentContainer = parentContainer;
        this.stack = stack;
        this.container = new PIXI.Container();
        this.connecting = false;
        parentContainer.addChild(this.container);

        this.waitText = new PIXI.Text('Waiting for players');
        this.waitText.x = 100;
        this.waitText.y = 100;
        this.waitText.style = new PIXI.TextStyle({fill: 0xFFFFFF});

        let background = new Graphics();
        background.beginFill(0x000000);
        background.drawRect(0, 0, 900, 1000);
        background.endFill();

        this.container.addChild(background);
        this.container.addChild(this.waitText);

        this.initConnection();
    }

    initConnection() {
        this.client = new GameClient();
        this.connecting = true;
        this.client.askStartGame(() => {this.connecting = false, this.startGame()});
    }

    startGame() {
        this.stack.change(new PlayState(this.stack, this.parentContainer, this.client));
    }

    destroy() {
        this.container.destroy();
        if (this.connecting) {
            this.client.disconnect();
        }
    }

    update(dt) {
        let baseText = 'Waiting for players';
        let dots = '';
        this.timer = this.timer + dt;
        for (let i = 0; i < Math.floor(this.timer / 1000) % 4; i++) {
            dots = dots + '.';
        }
        this.waitText.text = baseText + dots;
    }

    onKeydown(e) {
        if (e.keyCode === 27) {
            this.stack.pop();
        }
    }
}
