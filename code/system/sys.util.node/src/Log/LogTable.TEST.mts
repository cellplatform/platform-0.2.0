import { Table } from './index.mjs';
import { describe, it } from '../TEST/index.mjs';

describe('LogTable', () => {
  it('simple 2-column table (no borders)', () => {
    const table = Table();
    table.push(['one', 'hello']);
    table.push(['two', 'goodbye']);
    console.log(table.toString());
  });
});
