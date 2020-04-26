import IndividualAnimateState from "../front/pawnState/animateState";

export default class AnimatePawnsState {
    constructor(stack, pawns, futureColor) {
        this.stack = stack;
        this.states = pawns.map((p, i) => new IndividualAnimateState(this, p, futureColor, i));
    }

    update(dt) {
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

    enter() {

    }
    exit() {

    }

    destroy() {
        this.states = [];
    }
}
