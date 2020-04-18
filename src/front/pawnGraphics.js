let Graphics = PIXI.Graphics;

export default class PawnGraphics {
    constructor(squareSize) {
        this.shape = new Graphics();
        this.squareSize = squareSize;
        this.color = 0x000000;
        this.animateRotation = 0;
    }
    setPos(x, y) {
        this.shape.x = x * this.squareSize + this.squareSize / 2;
        this.shape.y = y * this.squareSize + this.squareSize / 2;
    }
    setColor(color) {
        this.color = color;
    }

    setAnimateRotation(r) {
        this.animateRotation = r;
        this.render();
    }

    render() {
        this.shape.clear();
        this.shape.beginFill(this.color == 1 ? 0xFFFFFF : 0x00000);
        this.shape.rotation = Math.PI / 4;
        let w = (this.squareSize - this.squareSize / 10)/2;
        let h = w * Math.abs(Math.cos(this.animateRotation));
        this.shape.drawEllipse(0, 0, w, h);
        this.shape.endFill();
    }
}
