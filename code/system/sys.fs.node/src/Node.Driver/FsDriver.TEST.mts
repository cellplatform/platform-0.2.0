import { describe, it, expect } from '../TEST/index.mjs';
import { FsDriver } from './index.mjs';

describe('FsDriver (Node)', () => {
  it('default', () => {
    const driver = FsDriver();
    expect(driver.dir).to.eql('/');
  });

  it('custon root directory', () => {
    const driver = FsDriver({ dir: ' foo/bar// ' });
    expect(driver.dir).to.eql('/foo/bar/');
  });
});
