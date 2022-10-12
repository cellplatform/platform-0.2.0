import { describe, it, expect } from '../test/index.mjs';

import { visit } from 'unist-util-visit';

function transformer(ast: any) {
  visit(ast, 'TYPE', visitor);
  function visitor(node: any) {
    const newNode = 'do work here';
    return Object.assign(node, newNode);
  }
}

function plugin() {
  return transformer;
}

// export default plugin;

describe('Plugin (Sample)', () => {
  it('tmp', async () => {
    //
    console.log('-------------------------------------------');
    console.log('visit', visit);
  });
});
