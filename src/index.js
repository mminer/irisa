import './style.css';
import Vue from 'vue';
import Enemy from './components/enemy';
import Player from './components/player';
import Wall from './components/wall';
import { SQUARE_SIZE } from './constants';
import { DOWN, LEFT, RIGHT, UP } from './keycodes';
import store from './store';

store.loadLevel(0);

new Vue({
  data: { state: store.state },
  el: 'main',
  render (createElement) {
    const { enemies, player, walls } = this.$root.$data.state;

    const enemyNodes = enemies.map(({ isDestroyed, x, y }) => createElement(Enemy, {
      props: { isDestroyed, x, y },
    }));

    const wallNodes = walls.map(({ x, y }) => createElement(Wall, {
      props: { x, y },
    }));

    return createElement('main', {
      on: {
        'click': event => {
          const { clientX, clientY } = event;
          const x = Math.floor(clientX / SQUARE_SIZE);
          const y = Math.floor(clientY / SQUARE_SIZE);
          store.movePlayerTo(x, y);
        },
      },
    }, [
      createElement(Player, {
        props: { x: player.x, y: player.y },
      }),
      ...enemyNodes,
      ...wallNodes,
    ]);
  },
});

const keyHandlers = {
  [DOWN]: () => store.movePlayerDown(),
  [LEFT]: () => store.movePlayerLeft(),
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
