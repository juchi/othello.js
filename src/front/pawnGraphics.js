let Graphics = PIXI.Graphics;

export default class PawnGraphics {
    constructor(squareSize) {
        this.shape = new Graphics();
        this.squareSize = squareSize;
        this.color = 0x000000;
    }
    setPos(x, y) {
        this.shape.x = x * this.squareSize + this.squareSize / 2;
        this.shape.y = y * this.squareSize + this.squareSize / 2;
    }
    setColor(color) {
        this.color = color;
        this.render();
    }

    render() {
        this.shape.clear();
        this.shape.beginFill(this.color == 1 ? 0xFFFFFF : 0x00000);
        this.shape.drawCircle(0, 0, (this.squareSize - this.squareSize / 10)/2);
        this.shape.endFill();
    }
}
