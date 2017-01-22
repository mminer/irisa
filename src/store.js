import { Door, Enemy, Player, Wall} from './entities';
import { createEntitiesFromLevel, findOverlappingEntities } from './util';
import levels from './levels';

export default {
  currentLevelNumber: 0,

  state: {
    rowCount: 0,
    columnCount: 0,

    entities: [],

    get door () {
      return this.entities.find(entity => entity instanceof Door);
    },

    get enemies () {
      return this.entities.filter(entity => entity instanceof Enemy);
    },

    get player () {
      return this.entities.find(entity => entity instanceof Player);
    },

    get walls () {
      return this.entities.filter(entity => entity instanceof Wall);
    },
  },

  get aliveEnemies () {
    return this.state.enemies.filter(enemy => !enemy.isDestroyed);
  },

  get isLossConditionMet () {
    const { x, y } = this.state.player;
    return this.aliveEnemies.some(enemy => enemy.isAtPosition(x, y));
  },

  get isWinConditionMet () {
    const { x, y } = this.state.door;
    return this.state.player.isAtPosition(x, y);
  },

  checkForWinOrLoss () {
    if (this.isLossConditionMet) {
      alert('Lost!');
      this.reloadLevel();
    } else if (this.isWinConditionMet) {
      alert('Won!');
      this.loadNextLevel();
    }
  },

  isWallAtPosition (x, y) {
    return this.state.walls.some(wall => wall.isAtPosition(x, y));
  },


  // Level management:

  loadLevel (levelNumber) {
    const level = levels[levelNumber];
    this.state.entities = createEntitiesFromLevel(level);
    this.state.rowCount = level.length;
    this.state.columnCount = level[0].length;
    this.currentLevelNumber = levelNumber;
  },

  loadNextLevel () {
    this.loadLevel(this.currentLevelNumber + 1);
  },

  reloadLevel () {
    this.loadLevel(this.currentLevelNumber);
  },


  // Enemy movement:

  killOverlappingEnemies () {
    findOverlappingEntities(this.aliveEnemies).forEach(enemy => {
      const { x, y } = enemy;

      if (!this.isWallAtPosition(x, y)) {
        const wall = new Wall(x, y);
        this.state.entities.push(wall);
      }

      enemy.isDestroyed = true;
    });
  },

  moveEnemies () {
    this.aliveEnemies.forEach(this.moveEnemy, this);
    this.killOverlappingEnemies();
  },

  moveEnemy (enemy) {
    const { player } = this.state;
    let { x, y } = enemy;

    // Move horizontally towards player.
    if (x < player.x) {
      x += 1;
    } else if (x > player.x) {
      x -= 1;
    }

    // Move vertically towards player.
    if (y < player.y) {
      y += 1;
    } else if (y > player.y) {
      y -= 1;
    }

    enemy.moveTo(x, y);

    if (this.isWallAtPosition(x, y)) {
      enemy.isDestroyed = true;
    }
  },


  // Player movement:

  movePlayerBy (xDelta, yDelta) {
    const { player } = this.state;
    let { x, y } = player;
    this.movePlayerTo(x + xDelta, y + yDelta);
  },

  movePlayerTo (x, y) {
    const { player } = this.state;
    const { x: currentX, y: currentY } = player;

    if (player.isBeyondMovementRange(x, y) || this.isWallAtPosition(x, y)) {
      return;
    }

    player.moveTo(x, y);
    this.moveEnemies();
    this.checkForWinOrLoss();
  },

  movePlayerDown () {
    this.movePlayerBy(0, 1);
  },

  movePlayerLeft () {
    this.movePlayerBy(-1, 0);
  },

  movePlayerRight () {
    this.movePlayerBy(1, 0);
  },

  movePlayerUp () {
    this.movePlayerBy(0, -1);
  },
};
