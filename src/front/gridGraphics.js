let Graphics = PIXI.Graphics;

export default class GridGraphics
{
    constructor(container, renderer) {
        this.rows = 1;
        this.cols = 1;

        this.vertSeps = [];
        this.horizSeps = [];
        this.width = 600;
        this.height = 600;
        this.squareSize = this.width / this.rows;

        this.board = new Graphics();
        this.container = container;
        this.renderer = renderer;
    }

    getGridPoint(pixelCoord) {
        let x = pixelCoord.x / this.squareSize;
        let y = pixelCoord.y / this.squareSize;

        return {x: x|0, y: y|0};
    }

    render() {
        this.board.beginFill(0x00ff00);
        this.board.drawRect(0, 0, this.width, this.height);
        this.board.endFill();
    
        let lineWidth = this.width / 100;
        for (let i of this.vertSeps.keys()) {
            let x = this.width / this.cols * (i + 1);
            let separator = this.vertSeps[i];
            separator.beginFill(0x009000);
            separator.drawRect(x - lineWidth/2, 0, lineWidth, this.height);
            separator.endFill();
        }
    
        lineWidth = this.height / 100;
        for (let i of this.vertSeps.keys()) {
            let y = this.height / this.cols * (i + 1);
            let separator = this.horizSeps[i];
            separator.beginFill(0x009000);
            separator.drawRect(0, y - lineWidth/2, this.width, lineWidth);
            separator.endFill();
        }
    }

    init(grid) {
        this.rows = grid.rows;
        this.cols = grid.rows;
        this.squareSize = this.width / this.rows;

        this.initShapes();
    }
    
    initShapes() {
        this.board = new Graphics();
        this.board.interactive = true;
        this.container.addChild(this.board);
    
        this.vertSeps = [];
        this.horizSeps = [];
        for (let i of [...Array(this.rows - 1).keys()]) {
            let verticalSep = new Graphics();
            this.vertSeps.push(verticalSep);
            this.container.addChild(verticalSep);
        }
        for (let i of [...Array(this.cols - 1).keys()]) {
            let horizontalSep = new Graphics();
            this.horizSeps.push(horizontalSep);
            this.container.addChild(horizontalSep);
        }
    
        this.board.on('click', (e) => this.handleGridClick(e));
    }

    handleGridClick(e) {
        let board = e.currentTarget;
        let p = new PIXI.Point(e.data.global.x, e.data.global.y);
        let relativePos = board.toLocal(p);
    
        let gridPoint = this.getGridPoint(relativePos);
   
        this.renderer.handleGridSelection(gridPoint.x, gridPoint.y);
    }
}
