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

        const currentPlayerText = new PIXI.Text();
        currentPlayerText.x = 0;
        currentPlayerText.y = 100;
        currentPlayerText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        this.container.addChild(currentPlayerText);

        const playerText = new PIXI.Text();
        playerText.x = 0;
        playerText.y = 50;
        playerText.style = new PIXI.TextStyle({fill: 0xFFFFFF});
        this.container.addChild(playerText);

        this.parentContainer.addChild(this.container);
        this.currentPlayerText = currentPlayerText;
        this.playerText = playerText;
    }

    updateCurrentPlayer(currentPlayer) {
        this.currentPlayerText.text = currentPlayer.color ? 'Les blancs jouent' :  'Les noirs jouent';
    }
    setPlayerInfo(localPlayerColor) {
        this.playerText.text = 'Vous jouez les ' + (localPlayerColor == 1 ? 'blancs' : 'noirs');
    }

    destroy() {
        this.container.destroy(true);
    }
}
