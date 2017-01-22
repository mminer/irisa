import './style.css';
import Vue from 'vue';
import EntityComponent from './entitycomponent';
import { DOWN, LEFT, R, RIGHT, UP } from './keycodes';
import store from './store';

store.reloadLevel();

new Vue({
  data: { state: store.state },
  el: 'main',
  render (createElement) {
    const { boardSize, entities } = this.$root.$data.state;

    const childElements = entities.map(entity => createElement(EntityComponent, {
      props: { boardSize, ...entity.props },
    }));

    return createElement('main', childElements);
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
