import { LogTable } from './index.mjs';
import { describe, it } from '../test/index.mjs';

describe('LogTable', () => {
  it('simple 2-column table (no borders)', () => {
    const table = LogTable();
    table.push(['one', 'hello']);
    table.push(['two', 'goodbye']);
    console.log(table.toString());
  });
});
