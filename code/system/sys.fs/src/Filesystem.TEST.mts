import { expect } from 'chai';

import { Filesize } from './Filesize/index.mjs';
import { Filesystem } from './Filesystem.mjs';
import { Path } from './Path/index.mjs';

describe('Filesystem', () => {
  it('exposes index of sub-modules', () => {
    expect(Filesystem.Filesize).to.equal(Filesize);
    expect(Filesystem.Path).to.equal(Path);
  });
});
