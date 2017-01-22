import './style.css';
import Vue from 'vue';
import Door from './components/door';
import Enemy from './components/enemy';
import Player from './components/player';
import Wall from './components/wall';
import { DOWN, LEFT, R, RIGHT, UP } from './keycodes';
import store from './store';

store.reloadLevel();

new Vue({
  data: { state: store.state },
  el: 'main',
  render (createElement) {
    const {
      boardSize,
      door,
      enemies,
      player,
      walls,
    } = this.$root.$data.state;

    const doorNode = createElement(Door, {
      props: { boardSize, x: door.x, y: door.y },
    });

    const playerNode = createElement(Player, {
      props: { boardSize, x: player.x, y: player.y },
    });

    const enemyNodes = enemies.map(({ isDestroyed, x, y }) => createElement(Enemy, {
      props: { boardSize, isDestroyed, x, y },
    }));

    const wallNodes = walls.map(({ x, y }) => createElement(Wall, {
      props: { boardSize, x, y },
    }));

    return createElement('main', [
      doorNode,
      playerNode,
      ...enemyNodes,
      ...wallNodes,
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
