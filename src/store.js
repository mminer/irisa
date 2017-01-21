export default {
  state: {
    enemies: [
      { x: 1, y: 3 },
      { x: 4, y: 4 },
      { x: 2, y: 9 },
    ],

    player: { x: 3, y: 7 },
  },

  moveDown () {
    this.state.player.y += 1;
  },

  moveLeft () {
    this.state.player.x -= 1;
  },

  moveRight () {
    this.state.player.x += 1;
  },

  moveUp () {
    this.state.player.y -= 1;
  },
};
