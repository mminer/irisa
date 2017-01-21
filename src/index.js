import './style.css';
import { DOWN, LEFT, RIGHT, UP } from 'key-codes';

const keyHandlers = {
  [LEFT]: () => console.log('left'),
  [UP]: () => console.log('up'),
  [RIGHT]: () => console.log('right'),
  [DOWN]: () => console.log('down'),
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
