export default class UI 
{
    constructor(parentContainer) {
        this.parentContainer = parentContainer;
        this.container = null;
        this.currentPlayerText = null;
        this.playerText = null;
    }

    setup() {
        this.container = new PIXI.Container();
        this.container.x = 620;
        this.container.y = 0;
        let y = 0;
        let x = 0;

        const currentPlayerText = new PIXI.Text();
        currentPlayerText.x = x;
        currentPlayerText.y = (y += 50);
        currentPlayerText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        this.container.addChild(currentPlayerText);

        const playerText = new PIXI.Text();
        playerText.x = x;
        playerText.y = (y += 50);
        playerText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        this.container.addChild(playerText);

        const infoText = new PIXI.Text();
        infoText.x = x;
        infoText.y = (y += 50);
        infoText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        this.container.addChild(infoText);

        this.parentContainer.addChild(this.container);
        this.currentPlayerText = currentPlayerText;
        this.playerText = playerText;
        this.infoText = infoText;
    }

    updateCurrentPlayer(currentPlayer) {
        this.currentPlayerText.text = currentPlayer.color ? 'Les blancs jouent' :  'Les noirs jouent';
    }
    setPlayerInfo(localPlayerColor) {
        this.playerText.text = 'Vous jouez les ' + (localPlayerColor == 1 ? 'blancs' : 'noirs');
    }

    info(msg) {
        this.infoText.text = msg;
    }

    destroy() {
        this.container.destroy(true);
    }
}
