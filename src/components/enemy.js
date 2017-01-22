import { getEntityStyle } from '../util';

export default {
  functional: true,

  props: {
    boardSize: { type: Number, required: true },
    isDestroyed: { type: Boolean, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },

  render: (createElement, { props }) => {
    const { boardSize, isDestroyed, x, y } = props;

    return createElement('div', {
      'class': {
        destroyed: isDestroyed,
        enemy: true,
        entity: true,
      },
      style: getEntityStyle(boardSize, x, y),
    });
  },
};
