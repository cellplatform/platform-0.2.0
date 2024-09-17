import { describe, expect, Fs, it, Path } from '../mod.ts';

describe('Path', () => {
  it('filesystem extensions', () => {
    expect(Path).to.equal(Fs.Path);
    expect(Path.exists).to.equal(Fs.exists);
    expect(Path.ensureDir).to.equal(Fs.ensureDir);
  });
});
