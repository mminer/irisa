import { Door, Enemy, FreezeTime, Player, Wall} from './entities';
import { createEntitiesFromLevel, findOverlappingEntities } from './util';
import levels from './levels';

export default {
  currentLevelNumber: 0,
  frozenTurnsRemaining: 0,

  state: {
    boardSize: 0,
    entities: [],
  },

  get enemies () {
    return this.state.entities
      .filter(entity => entity instanceof Enemy)
      .filter(enemy => !enemy.isDisabled);
  },

  get isEnemiesFrozen () {
    return this.frozenTurnsRemaining > 0;
  },

  get isLossConditionMet () {
    const { x, y } = this.player;
    return this.enemies.some(enemy => enemy.isAt(x, y));
  },

  get isWinConditionMet () {
    const door = this.state.entities.find(entity => entity instanceof Door);
    const { x, y } = door;
    return this.player.isAt(x, y);
  },

  get player () {
    return this.state.entities.find(entity => entity instanceof Player);
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

  isBeyondBoundary (x, y) {
    const { boardSize } = this.state;
    return x < 0 || x >= boardSize || y < 0 || y >= boardSize;
  },

  isWallAt (x, y) {
    return this.state.entities
      .filter(entity => entity instanceof Wall)
      .some(wall => wall.isAt(x, y));
  },

  pickUpCollectablesAt (x, y) {
    const freezeTime = this.state.entities
      .filter(entity => entity instanceof FreezeTime)
      .filter(entity => !entity.isDisabled)
      .find(freezeTime => freezeTime.isAt(x, y));

    if (!freezeTime) {
      return;
    }

    this.frozenTurnsRemaining = freezeTime.forTurns;
    freezeTime.isDisabled = true;
  },


  // Level management:

  loadLevel (levelNumber) {
    const level = levels[levelNumber];
    this.state.boardSize = level.length;
    this.state.entities = createEntitiesFromLevel(level);
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
    findOverlappingEntities(this.enemies).forEach(enemy => {
      const { x, y } = enemy;

      if (!this.isWallAt(x, y)) {
        const wall = new Wall(x, y);
        this.state.entities.push(wall);
      }

      enemy.isDisabled = true;
    });
  },

  moveEnemies () {
    if (this.isEnemiesFrozen) {
      return;
    }

    this.enemies.forEach(this.moveEnemy, this);
    this.killOverlappingEnemies();
  },

  moveEnemy (enemy) {
    const { player } = this;
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

    if (this.isWallAt(x, y)) {
      enemy.isDisabled = true;
    }
  },


  // Player movement:

  movePlayerBy (xDelta, yDelta) {
    const { player } = this;
    let { x, y } = player;
    x += xDelta;
    y += yDelta;

    if (this.isBeyondBoundary(x, y) || player.isBeyondMovementRange(x, y) || this.isWallAt(x, y)) {
      return;
    }

    player.moveTo(x, y);
    this.pickUpCollectablesAt(x, y);
    this.moveEnemies();
    this.frozenTurnsRemaining = Math.max(this.frozenTurnsRemaining - 1, 0);
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
