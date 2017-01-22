import './style.css';
import Vue from 'vue';
import Board from './components/board';
import Footer from './components/footer';
import Nav from './components/nav';
import { DOWN, LEFT, R, RIGHT, UP } from './keycodes';
import levels from './levels';
import store from './store';

store.reloadLevel();

new Vue({
  data: { state: store.state },
  el: '#app',
  render (createElement) {
    const { boardSize, currentLevelNumber, entities } = this.$root.$data.state;

    return createElement('div', {
      attrs: { id: 'app' },
    }, [
      createElement(Nav, {
        props: {
          currentLevelNumber,
          levelCount: levels.length,
          loadLevel: levelNumber => store.loadLevel(levelNumber),
        },
      }),
      createElement(Board, {
        props: { boardSize, entities },
      }),
      createElement(Footer),
    ]);
  },
});

const keyHandlers = {
  [DOWN]: () => store.movePlayerDown(),
  [LEFT]: () => store.movePlayerLeft(),
  [R]: () => store.reloadLevel(),
  [RIGHT]: () => store.movePlayerRight(),
  [UP]: () => store.movePlayerUp(),
};

const keysCurrentlyPressed = new Set();

document.addEventListener('keydown', evt => {
  const { keyCode } = evt;

  // Prevent keys from repeating.
  if (keysCurrentlyPressed.has(keyCode)) {
    return;
  }

  const handler = keyHandlers[keyCode];

  // Ignore keys that we lack a handler for.
  if (!handler) {
    return;
  }

  handler();
  keysCurrentlyPressed.add(keyCode);

  evt.preventDefault();
  evt.stopPropagation();
});

document.addEventListener('keyup', evt => {
  keysCurrentlyPressed.delete(evt.keyCode);
});
