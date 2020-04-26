import { Graphics } from 'pixi.js';
import GameClient from '../gameClient.js';
import PlayState from './playState.js';

export default class WaitRemoteState {
    constructor(stack, parentContainer) {
        this.parentContainer = parentContainer;
        this.stack = stack;
        this.container = new PIXI.Container();
        this.connecting = false;
        parentContainer.addChild(this.container);

        const waitText = new PIXI.Text('Waiting for players');
        waitText.x = 100;
        waitText.y = 100;
        waitText.style = new PIXI.TextStyle({fill: 0xFFFFFF});

        let background = new Graphics();
        background.beginFill(0x000000);
        background.drawRect(0, 0, 900, 1000);
        background.endFill();

        this.container.addChild(background);
        this.container.addChild(waitText);

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

    onKeydown(e) {
        if (e.keyCode === 27) {
            this.stack.pop();
        }
    }
}
