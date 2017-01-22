export default {
  functional: true,

  render: createElement => createElement('footer', [
    'bits and bytes by ',
    createElement('a', {
      attrs: { href: 'http://matthewminer.com' },
    }, 'Matthew Miner')
  ]),
};
