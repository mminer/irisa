import { SQUARE_SIZE } from './constants';
import { Entity } from './entities';

export function createEntitiesFromLevel (level) {
  return level.reduce((entityArray, rowLine, y) => {
    return rowLine
      .split('')
      .map((glyph, x) => Entity.fromGlyph(glyph, x, y))
      .filter(entity => entity)
      .concat(entityArray);
  }, []);
}

export function findOverlappingEntities (entities) {
  const positionMap = entities
    // Create map where key = position, value = array of entities at position.
    .reduce((map, entity) => {
      const { x, y } = entity;
      const position = `${x}-${y}`;
      const entitiesPreviouslyAtPosition = map.get(position) || [];
      const entitiesAtPosition = entitiesPreviouslyAtPosition.concat(entity);
      map.set(position, entitiesAtPosition);
      return map;
    }, new Map());

  return Array.from(positionMap)
    .filter(([position, entitiesAtPosition]) => entitiesAtPosition.length > 1)
    .reduce((entitiesArray, [position, entitiesAtPosition]) => {
      return entitiesArray.concat(entitiesAtPosition);
    }, []);
}

export function getEntityStyle (x, y) {
  return {
    left: `${x * SQUARE_SIZE}px`,
    top: `${y * SQUARE_SIZE}px`,
  };
}
