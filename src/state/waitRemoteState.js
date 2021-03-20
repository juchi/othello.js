import { Graphics } from 'pixi.js';
import 'pixi-text-input';
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

        let background = new Graphics();
        background.beginFill(0x000000);
        background.drawRect(0, 0, 900, 1000);
        background.endFill();

        this.playerInfoContainer = new PIXI.Container();
        this.playerInfoContainer.x = 100;
        this.waitContainer = new PIXI.Container();
        this.waitContainer.x = 100;
        this.container.addChild(background);
        this.container.addChild(this.playerInfoContainer);
        this.container.addChild(this.waitContainer);

        this.init();
    }

    initConnection() {
        this.client = new GameClient();
        this.connecting = true;
        this.client.askStartGame({playerName: this.playerName}, () => {this.connecting = false, this.startGame()});
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

    init() {
        this.initNameInput();
    }

    enter() {

    }
    exit() {

    }

    initWaitText() {
        this.waitText = new PIXI.Text('Waiting for players');
        this.waitText.x = 0;
        this.waitText.y = 100;
        this.waitText.style = new PIXI.TextStyle({fill: 0xFFFFFF});

        this.waitContainer.addChild(this.waitText);
    }

    initNameInput() {
        let nameText = new PIXI.Text('Enter your name');
        nameText.x = 0;
        nameText.y = 100;
        nameText.style = new PIXI.TextStyle({fill: 0xFFFFFF});

        this.playerInfoContainer.addChild(nameText);

        this.input = new PIXI.TextInput({
            input: {
                fontSize: '36px',
                padding: '12px',
                width: '500px',
                color: '#26272E'
            },
            box: {
                default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
                focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
                disabled: {fill: 0xDBDBDB, rounded: 12}
            }
        })

        this.input.placeholder = '';
        this.input.x = 0;
        this.input.y = 200;
        this.playerInfoContainer.addChild(this.input);

        const validateText = new PIXI.Text('Continue');
        validateText.x = 0;
        validateText.y = 300;
        validateText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        validateText.interactive = true;
        validateText.buttonMode = true;
        validateText.on('pointerdown', this.validatePlayerInfo.bind(this));

        this.playerInfoContainer.addChild(validateText);
    }

    validatePlayerInfo() {
        this.input.destroy();
        this.playerInfoContainer.removeChildren();

        this.waiting = true;
        this.playerName = this.input.text;

        this.initWaitText();
        this.initConnection();
    }

    update(dt) {
        if (this.connecting) {
            let baseText = 'Waiting for players';
            let dots = '';
            this.timer = this.timer + dt;
            for (let i = 0; i < Math.floor(this.timer / 1000) % 4; i++) {
                dots = dots + '.';
            }
            this.waitText.text = baseText + dots;
        }
    }

    onKeydown(e) {
        if (e.keyCode === 27) {
            this.stack.pop();
        }
    }
}
