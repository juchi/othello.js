import MenuState from './state/menuState.js';
import StateStack from './state/stateStack.js';

let windowWidth = 1000;
const app = new PIXI.Application({width: windowWidth, height: 900});
document.body.appendChild(app.view);

start();

// game logic
function start() {
    let stateStack = new StateStack();
    stateStack.push(new MenuState(stateStack, app.stage));

    window.addEventListener('keydown', function (e) {
        console.log(e);
        stateStack.length() && stateStack.current().onKeydown(e);
    });
}
