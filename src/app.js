import MenuState from './state/menuState.js';
import StateStack from './state/stateStack.js';

const app = new PIXI.Application({resizeTo: window});
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

    let previousTime = null;
    function loop(time) {
        if (previousTime === null) {
            previousTime = time;
        }
        let dt = time - previousTime;
        previousTime = time;

        stateStack.length() && stateStack.current().update(dt);

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}
