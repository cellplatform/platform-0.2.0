import { log } from './index.mjs';

describe('Log (Node)', () => {
  it('table', () => {
    const table = log.Table();

    table.push([log.gray('one'), 'hello']);
    table.push(['two', 'goodbye']);

    console.log(table.toString());
  });
});
