import { ENEMY, PLAYER, WALL } from './glyphs';

export class Entity {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  isAtPosition (x, y) {
    return this.x === x && this.y == y;
  }

  isBeyondMovementRange (x, y) {
    const xDelta = Math.abs(this.x - x);
    const yDelta = Math.abs(this.y - y);
    return xDelta > 1 || yDelta > 1;
  }

  moveTo (x, y) {
    this.x = x;
    this.y = y;
  }

  static fromGlyph (glyph, x, y) {
    switch (glyph) {
      case ENEMY:
        return new Enemy(x, y);

      case PLAYER:
        return new Player(x, y);

      case WALL:
        return new Wall(x, y);

      default:
        return null;
    }
  }
}

export class Enemy extends Entity {
  constructor (x, y) {
    super(x, y);
    this.isDestroyed = false;
  }
}

export class Player extends Entity {}
export class Wall extends Entity {}
