import { Log, Table } from './index.mjs';
import { log } from 'sys.log';

describe('Log (Node)', () => {
  it('table', () => {
    const table = Table();
    table.push([Log.gray('one'), 'hello']);
    table.push(['two', 'goodbye']);
    console.log(table.toString());
  });

  it('level.[color]', () => {
    console.log('-------------------------------------------');

    Log.info.green(`info: green, ${Log.cyan('hello', 123)}`, 123);
    Log.info.gray('gray', Log.green(456));
    Log.warn.cyan(`warn: cyan, ${Log.magenta('hello', 123)}`, 123);
  });

  it('FOO', () => {
    log.warn('hello warn');
  });
});
