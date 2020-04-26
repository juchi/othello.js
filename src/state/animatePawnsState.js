import IndividualAnimateState from "../front/pawnState/animateState";

export default class AnimatePawnsState {
    constructor(stack, pawns, futureColor) {
        this.stack = stack;
        this.previous = null;
        this.frameId = window.requestAnimationFrame(this.thick.bind(this));

        this.states = pawns.map((p, i) => new IndividualAnimateState(this, p, futureColor, i));
    }

    thick(time) {
        if (this.previous === null) {
            this.previous = time;
        }
        let dt = time - this.previous;
        this.previous = time;

        for (let pawnState of this.states) {
            pawnState.update(dt);
        }

        this.frameId = window.requestAnimationFrame(this.thick.bind(this));
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
        window.cancelAnimationFrame(this.frameId);
        this.states = [];
    }
}
