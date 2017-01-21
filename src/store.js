import { ENEMY, PLAYER, WALL } from 'glyphs';
import levels from 'levels';

export default {
  state: {
    enemies: [
      { x: 1, y: 3 },
      { x: 4, y: 4 },
      { x: 2, y: 9 },
    ],

    player: { x: 3, y: 7 },

    walls: [
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
    ]
  },

  getLevelTiles (index) {
    const level = levels[index];

    return level.reduce((tileArray, row, y) => {
      const rowTiles = row
        .split('')
        .map((glyph, x) => ({ glyph, x, y }));

      return tileArray.concat(rowTiles);
    }, []);
  },

  isWallAtPosition (x, y) {
    return this.state.walls.some(wall => wall.x === x && wall.y === y);
  },

  loadLevel (index) {
    const tiles = this.getLevelTiles(index);
    this.state.enemies = tiles.filter(tile => tile.glyph === ENEMY);
    this.state.player = tiles.find(tile => tile.glyph === PLAYER);
    this.state.walls = tiles.filter(tile => tile.glyph === WALL);
  },

  moveCharacter (character, deltaX, deltaY) {
    let { x, y } = character;
    x += deltaX;
    y += deltaY;

    // Disallow moving into a wall.
    if (this.isWallAtPosition(x, y)) {
      return false;
    }

    character.x = x;
    character.y = y;
    return true
  },


  // Enemy movement:

  moveEnemies () {
    setTimeout(() => {
      this.state.enemies.forEach(enemy => this.moveEnemy(enemy));
    }, 1000);
  },

  moveEnemy (enemy) {
    const { player } = this.state;
    const { x, y } = enemy;
    let deltaX = 0;
    let deltaY = 0;

    // Move horizontally towards player.
    if (x < player.x) {
      deltaX = 1;
    } else if (x > player.x) {
      deltaX = -1;
    }

    // Move vertically towards player.
    if (y < player.y) {
      deltaY = 1;
    } else if (y > player.y) {
      deltaY = -1;
    }

    this.moveCharacter(enemy, deltaX, deltaY);
  },


  // Player movement:

  movePlayer (deltaX, deltaY) {
    const didMove = this.moveCharacter(this.state.player, deltaX, deltaY);

    if (!didMove) {
      return;
    }

    this.moveEnemies();
  },

  moveDown () {
    this.movePlayer(0, 1);
  },

  moveLeft () {
    this.movePlayer(-1, 0);
  },

  moveRight () {
    this.movePlayer(1, 0);
  },

  moveUp () {
    this.movePlayer(0, -1);
  },
};
