import { describe, expect, it } from './test';

import { Filesize } from './common';
import { Filesystem } from './Filesystem.mjs';
import { Path } from './Path';

describe('Filesystem', () => {
  it('exposes index of sub-modules', () => {
    expect(Filesystem.Filesize).to.equal(Filesize);
    expect(Filesystem.Path).to.equal(Path);
  });
});
