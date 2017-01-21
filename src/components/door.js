import { getEntityStyle } from '../util';

export default {
  functional: true,

  props: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },

  render: (createElement, { props }) => {
    const { x, y } = props;

    return createElement('div', {
      'class': 'entity door',
      style: getEntityStyle(x, y),
    });
  },
};

