import './style.css';
import Vue from 'vue';
import Enemy from 'components/enemy';
import Player from 'components/player';
import Wall from 'components/wall';
import { DOWN, LEFT, RIGHT, UP } from 'keycodes';
import store from 'store';

new Vue({
  data: { state: store.state },
  el: 'main',
  render (createElement) {
    const { enemies, player, walls } = this.$root.$data.state;

    const enemyNodes = enemies.map(enemy => createElement(Enemy, {
      props: enemy,
    }));

    const wallNodes = walls.map(wall => createElement(Wall, { props: wall }));

    return createElement('main', [
      createElement(Player, { props: player }),
      ...enemyNodes,
      ...wallNodes,
    ]);
  },
});

const keyHandlers = {
  [DOWN]: () => store.moveDown(),
  [LEFT]: () => store.moveLeft(),
  [RIGHT]: () => store.moveRight(),
  [UP]: () => store.moveUp(),
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
