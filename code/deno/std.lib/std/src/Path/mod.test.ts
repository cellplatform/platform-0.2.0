import { expect, Path, describe, it } from '../mod.ts';

describe('Path', () => {
  it('join', () => {
    expect(Path.join('foo', 'bar')).to.eql('foo/bar');
  });
});
