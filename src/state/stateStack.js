export default class StateStack {
    constructor() {
        this.array = [];
    }

    pop() {
        let oldState = this.array.pop();
        oldState.exit();
        oldState.destroy();

        if (this.array.length > 0) {
            this.current().enter();
        }

        return oldState;
    }

    push(state) {
        if (this.array.length > 0) {
            this.current().exit();
        }
        this.array.push(state);
        state.enter();
        return state;
    }

    change(state) {
        let oldState = this.array.pop();
        oldState.exit();
        oldState.destroy();
        this.array.push(state);
        state.enter();

        return oldState;
    }

    length() {
        return this.array.length;
    }

    current() {
        if (this.array.length == 0) {
            return null;
        }

        return this.array[this.array.length - 1];
    }
}
