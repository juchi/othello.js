export default class StateStack {
    constructor() {
        this.array = [];
    }

    pop() {
        return this.array.pop();
    }

    push(state) {
        this.array.push(state);
        return state;
    }

    change(state) {
        let oldState = this.array.pop();
        this.array.push(state);

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
