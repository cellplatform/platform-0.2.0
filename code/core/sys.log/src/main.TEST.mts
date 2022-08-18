import { log } from './main.mjs';

describe('main', () => {
  it('levels', () => {
    log.info(1, 2, 'three', { foo: 123 }, true, undefined, null);
    log.warn('warn', { foo: 123 }, true);
    log.error('error', { foo: 123 }, false, undefined, null);
  });

  it('level.[color]', () => {
    // log.info.gr
    log.info.green(`info: green, ${log.cyan('hello', 123)}`, 123);
    // console.log('log.info.green', log.info.green);
  });

  it('colors', () => {
    log.info();
    log.info('black', log.black('hello'));
    log.info('red', log.red('hello'));
    log.info('green', log.green('hello'));
    log.info('yellow', log.yellow('hello'));
    log.info('blue', log.blue('hello'));
    log.info('magenta', log.magenta('hello'));
    log.info('cyan', log.cyan('hello'));
    log.info('white', log.white('hello'));
    log.info('gray', log.gray('hello'));
  });
});
