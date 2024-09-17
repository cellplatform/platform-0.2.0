import { describe, expect, it } from '../common.ts';
import { Path } from './mod.ts';

describe('Path', () => {
  it('join', () => {
    expect(Path.join('foo', 'bar')).to.eql('foo/bar');
  });
});
