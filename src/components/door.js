import { getEntityStyle } from '../util';

export default {
  functional: true,

  props: {
    boardSize: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },

  render: (createElement, { props }) => {
    const { boardSize, x, y } = props;

    return createElement('div', {
      'class': 'entity door',
      style: getEntityStyle(boardSize, x, y),
    });
  },
};

