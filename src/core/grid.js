module.exports = class Grid
{
    constructor() {
        this.rows = 8;
        this.cols = 8;
        this.pawns = [];
    }

    clear() {
        this.pawns = [];
    }

    isMoveAllowed(x, y, color) {
        if (!this.isEmptySquare(x, y)) {
            return false;
        }

        return this.searchFlippablePawns(x, y, color).length > 0;
    }

    isEmptySquare(x, y) {
        return this.getPawn(x, y) == null;
    }

    getPawn(x, y) {
        if (!this.pawns[x]) {            
            return null;
        }
        if (!this.pawns[x][y]) {            
            return null;
        }

        return this.pawns[x][y];
    }

    addPawn(pawn) {
        if (!this.isEmptySquare(pawn.x, pawn.y)) {
            throw 'Cannot add pawn : square is not empty';
        }

        if (!this.pawns[pawn.x]) {
            this.pawns[pawn.x] = [];
        }
        this.pawns[pawn.x][pawn.y] = pawn;
    }

    searchFlippablePawns(baseX, baseY, color) {
        let flippable = [];
        let processors = [
            // horitonzal
            {check: (x, y) => x > 0, getCoords: (x, y) => [--x, y]},
            {check: (x, y) => x < this.cols - 1, getCoords: (x, y) => [++x, y]},
            //vertical
            {check: (x, y) => y > 0, getCoords: (x, y) => [x, --y]},
            {check: (x, y) => y < this.rows - 1, getCoords: (x, y) => [x, ++y]},
            // diags
            {check: (x, y) => x > 0 && y > 0, getCoords: (x, y) => [--x, --y]},
            {check: (x, y) => x > 0 && y < this.rows - 1, getCoords: (x, y) => [--x, ++y]},
            {check: (x, y) => x < this.cols - 1 && y > 0, getCoords: (x, y) => [++x, --y]},
            {check: (x, y) => x < this.cols - 1 && y < this.rows - 1, getCoords: (x, y) => [++x, ++y]},
        ]
        for (let processor of processors) {
            // keep track of potential enemy pawns to flip
            let stack = [];
            let x = baseX;
            let y = baseY;
            while (processor.check(x, y)) {
                [x, y] = processor.getCoords(x, y);
                let pawn = this.getPawn(x, y);
                if (this.handlePawnCheck(pawn, color, stack, flippable) === false) {
                    break;
                }
            }
        }

        return flippable;
    }

    handlePawnCheck(pawn, color, stack, flippable) {        
        if (!pawn) {
            // empty square, no flipping
            return false;
        }
        if (pawn.color == color) {
            // friend pawn found, stop browsing
            Array.prototype.push.apply(flippable, stack);
            return false;
        }
        // continue browsing enemy pawns
        stack.push(pawn);
        return true;
    }
}
