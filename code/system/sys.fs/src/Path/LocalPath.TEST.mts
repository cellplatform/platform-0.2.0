import { expect } from '../TEST/index.mjs';
import { LocalPath } from './LocalPath.mjs';

describe('LocalPath', () => {
  it('toAbsolute', () => {
    const test = (path: string, root: string, expected: string) => {
      const res1 = LocalPath.toAbsolutePath({ path, root });
      const res2 = LocalPath.toAbsoluteLocation({ path, root });
      expect(res1).to.eql(expected);
      expect(res2).to.eql(`file://${expected}`);
    };

    test('  ', ' /Users/bob/ ', '/Users/bob/');
    test(' /foo/bar.png ', ' /Users/bob/ ', '/Users/bob/foo/bar.png');
    test('foo/bar.png', '/Users/bob', '/Users/bob/foo/bar.png');
    test('foo/bar.png', '/Users/bob///', '/Users/bob/foo/bar.png');
    test('/Users/bob/foo/bar.png', '/Users/bob', '/Users/bob/foo/bar.png');
    test('/Users/bob/foo/bar.png', '/Users/bob/', '/Users/bob/foo/bar.png');

    test(' ~/foo/bar.png', '/Users/bob', '/Users/bob/foo/bar.png'); // NB: Strip home ("~") prefix character.

    // NB: home ("~") prefix character not stripped if part of filename.
    test(' ~foo/bar.png  ', '/Users/bob', '/Users/bob/~foo/bar.png');
    test('/~foo/bar.png', '/Users/bob', '/Users/bob/~foo/bar.png');
  });

  it('toRelative', () => {
    const test = (path: string, root: string, expected: string) => {
      const res1 = LocalPath.toRelativePath({ path, root });
      const res2 = LocalPath.toRelativeLocation({ path, root });
      expect(res1).to.eql(expected);
      expect(res2).to.eql(`file://${expected}`);
    };

    // No absolute prefix match.
    test(' /foo/bar.png ', ' /Users/bob/ ', '~/foo/bar.png');
    test('///foo/bar.png ', ' /Users/bob/ ', '~/foo/bar.png');
    test(' foo/bar.png ', ' /Users/bob/ ', '~/foo/bar.png');
    test(' ~/foo/bar.png ', ' /Users/bob/ ', '~/foo/bar.png');
    test(' ~//foo/bar.png ', ' /Users/bob/ ', '~/foo/bar.png');

    // Match absolute prefix.
    test(' /Users/bob/foo/bar.png ', ' /Users/bob/ ', '~/foo/bar.png');
    test('file:///Users/bob/foo/bar.png ', ' /Users/bob/ ', '~/foo/bar.png');
  });
});
