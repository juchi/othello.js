import { Graphics } from 'pixi.js';
import 'pixi-text-input';
import GameClient from '../gameClient.js';
import PlayState from './playState.js';
import state from '../state.js';

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
    }

    initConnection(roomId) {
        this.client = new GameClient();
        this.connecting = true;
        this.client.askStartGame({playerName: this.playerName, roomId: roomId}, () => {this.connecting = false, this.startGame()});
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

    enter() {
        this.initNameInput();
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

        let nameInput = new PIXI.TextInput(inputStyle);
        nameInput.x = 0;
        nameInput.y = 200;
        if (state.name) {
            nameInput.text = state.name;
        }
        this.playerInfoContainer.addChild(nameInput);

        let roomText = new PIXI.Text('Room ID to join (leave empty to join any)');
        roomText.x = 400;
        roomText.y = 100;
        roomText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        this.playerInfoContainer.addChild(roomText);
        let roomInput = new PIXI.TextInput(inputStyle)
        roomInput.x = 400;
        roomInput.y = 200;
        this.playerInfoContainer.addChild(roomInput);

        const validateText = new PIXI.Text('Search game');
        validateText.x = 400;
        validateText.y = 300;
        validateText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        validateText.interactive = true;
        validateText.buttonMode = true;
        validateText.on('pointerdown', () => {
            this.validatePlayerInfo(nameInput.text, roomInput.text);
        });

        this.playerInfoContainer.addChild(validateText);

        const privateText = new PIXI.Text('Create private game');
        privateText.x = 400;
        privateText.y = 400;
        privateText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        privateText.interactive = true;
        privateText.buttonMode = true;
        privateText.on('pointerdown', () => {
            this.validatePlayerInfo(nameInput.text, -1);
        });

        this.playerInfoContainer.addChild(privateText);
    }

    validatePlayerInfo(playerName, roomId) {
        let valid = playerName.length > 0;
        if (valid) {
            state.name = playerName;
            this.playerInfoContainer.removeChildren();

            this.waiting = true;
            this.playerName = playerName;

            this.initWaitText();
            this.initConnection(roomId);
        }
    }

    update(dt) {
        if (this.connecting) {
            let baseText = 'Waiting for players';
            if (state.privateRoomId) {
                baseText += ' in room ' + state.privateRoomId;
            }
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

let inputStyle = {
    input: {
        fontSize: '36px',
        padding: '12px',
        width: '250px',
        color: '#26272E'
    },
    box: {
        default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
        focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
        disabled: {fill: 0xDBDBDB, rounded: 12}
    }
};
