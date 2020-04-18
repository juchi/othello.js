import IndividualAnimateState from "../front/pawnState/animateState";

export default class AnimatePawnsState {
    constructor(stack, pawns, futureColor) {
        this.stack = stack;
        this.previous = Date.now();
        this.interval = setInterval(() => {
            let time = Date.now();
            this.thick(time - this.previous)
            this.previous = time;
        }, 100);
        this.states = pawns.map((p, i) => new IndividualAnimateState(this, p, futureColor, i));
    }

    thick(dt) {
        for (let pawnState of this.states) {
            pawnState.update(dt);
        }
    }

    onKeyDown() {

    }

    notifyDone(pawnState) {
        this.states = this.states.filter((s) => s !== pawnState);
        
        if (this.states.length === 0) {
            this.stack.pop();
        }
    }

    destroy() {
        clearInterval(this.interval);
        this.states = null;
    }
}
