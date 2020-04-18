
export default class AnimateState {
    constructor(parent, pawn, futureColor, index) {
        this.pawn = pawn;
        this.parent = parent;
        this.t = 0;
        this.futureColor = futureColor;
        this.index = index;
    }

    update(dt) {
        this.t += dt;
        if (this.t < this.index * 200) { // offset each pawn animation for nice effect
            return;
        }
        let t = this.t - this.index * 100;
        let r = (t / 1000) * Math.PI / 1; // divide /1000 for ms => s, divide /1 sec animation time
        if (r > Math.PI / 2) {
            this.pawn.setColor(this.futureColor);
        }
        if (r > Math.PI) {
            r = Math.PI;
            this.done();
        }
        this.pawn.graphics.setAnimateRotation(r);
    }

    done() {
        this.parent.notifyDone(this);
    }
}
