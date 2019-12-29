module.exports = class Pawn
{
    constructor() {
        this.x = 0;
        this.y = 0;
        this.color = 0;
        this.graphics = null;
    }

    initGraphics(graphics) {
        this.graphics = graphics;
    }

    setColor(color) {
        this.color = color;
        this.graphics && this.graphics.setColor(color);
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.graphics && this.graphics.setPos(x, y);
    }
}
