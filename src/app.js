import MenuState from './menuState.js';

let windowWidth = 1000;
const app = new PIXI.Application({width: windowWidth, height: 900});
document.body.appendChild(app.view);

start();

// game logic
function start() {
    let stateStack = [];
    stateStack.push(new MenuState(stateStack, app.stage));

    window.addEventListener('keydown', function (e) {
        console.log(e);
        stateStack.length && stateStack[stateStack.length - 1].onKeydown(e);
    });
}
