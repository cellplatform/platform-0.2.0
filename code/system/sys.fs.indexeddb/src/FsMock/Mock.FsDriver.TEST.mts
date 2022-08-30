import { describe, it, expect } from '../TEST/index.mjs';
import { FsMockDriver } from './Mock.FsDriver.mjs';

describe('FsDriver (Mock)', () => {
  it('no params', () => {
    const mock = FsMockDriver();
    const driver = mock.driver;

    expect(driver.dir).to.eql('/');
    expect(driver.type).to.eql('LOCAL');
  });

  it('dir param', () => {
    const mock = FsMockDriver({ dir: '/foo/bar' });
    const driver = mock.driver;
    expect(driver.dir).to.eql('/foo/bar');
  });

  describe('info', () => {
    it('no handler', async () => {
      //
      const mock = FsMockDriver();

      const res = await mock.driver.info('foo/bar.txt');
      console.log('res', res);
    });

    it('override info', async () => {
      //
    });
  });
});
