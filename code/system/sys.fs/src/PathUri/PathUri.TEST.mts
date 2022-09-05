import { expect, describe, it } from '../TEST/index.mjs';
import { PathUri } from './index.mjs';

describe('PathUri', () => {
  it('prefix', () => {
    expect(PathUri.prefix).to.eql('path');
  });

  it('is', () => {
    const test = (input: any, expected: boolean) => {
      expect(PathUri.isPathUri(input)).to.eql(expected);
    };

    test('path:foo/bar.txt', true);
    test('  path:foo/bar.txt  ', true);

    test('file:foo:123', false);
    test('  file:foo:123  ', false);
    test('', false);
    test('/foo', false);
    test(null, false);
    test({}, false);
  });

  it('path', () => {
    const test = (input: any, expectedPath: string | undefined) => {
      const res = PathUri.path(input);
      expect(res).to.eql(expectedPath, input);
    };

    test('', '');
    test('foo/bar', ''); // Not a URI (no "path:" prefix)

    test(null, '');
    test(undefined, '');
    test({}, '');
    test([], '');
    test(true, '');
    test(123, '');

    test('path:foo/bar', 'foo/bar');
    test('  path:foo/bar  ', 'foo/bar');
    test('path:///foo/bar', '/foo/bar');
    test('path:foo/bar/', 'foo/bar/');

    test('path:', '/');
    test('  path:  ', '/');

    test('path:./foo', 'foo');
    test('path:../foo', '');
    test('path:foo/../bar', 'bar');
    test('path:foo/bar/../zoo', 'foo/zoo');

    // NB: Stepped up and out of scope (security risk).
    test('path:....../foo', '');
    test('path:foo/../../bar', '');
    test('path:foo/../../../bar', '');
  });

  describe('ensureUriPrefix', () => {
    it('input variants', () => {
      const test = (input: any, expected: string) => {
        const uri = PathUri.ensureUriPrefix(input);
        expect(uri.startsWith('path:')).to.eql(true, uri);
        expect(uri).to.eql(expected, input);

        const path = PathUri.path(uri);
        expect(path).to.eql(PathUri.path(expected));

        // NB: Test reconstructing the URI from the extracted path.
        expect(PathUri.ensureUriPrefix(path)).to.eql(expected, path);
      };

      test('', 'path:/');
      test('  ', 'path:/');
      test('path:', 'path:/');
      test(' path: ', 'path:/');

      test('.', 'path:/');
      test(' . ', 'path:/');
      test(' ./ ', 'path:/');
      test(' ./// ', 'path:/');
      test('path:.', 'path:/');
      test('path:./', 'path:/');

      test('path', 'path:path'); // NB: not a URI prefix.
      test('path:foo', 'path:foo');
      test('  path:foo/bar  ', 'path:foo/bar');
      test('  path:/foo/bar.png  ', 'path:/foo/bar.png');
      test('  foo  ', 'path:foo');

      test('./foo', 'path:foo'); // NB: relative root
      test('foo/bar', 'path:foo/bar');
      test('/foo/bar', 'path:/foo/bar');
      test('  /foo/bar/  ', 'path:/foo/bar/');
      test('///foo/bar/  ', 'path:/foo/bar/');

      test('.manifest.json', 'path:.manifest.json');
      test('.file ', 'path:.file');
      test(' .filename.yaml ', 'path:.filename.yaml');

      test('path:./foo', 'path:foo');
      test('path:foo/../bar', 'path:bar');
      test('path:foo/bar/../zoo', 'path:foo/zoo');
    });

    it('invalid input - stepped out of root (security)', () => {
      const test = (input: any) => {
        const fn = () => PathUri.ensureUriPrefix(input, { throw: true });
        expect(fn).to.throw(/Invalid input/);
        expect(PathUri.ensureUriPrefix(input)).to.eql('', input);
      };

      test(undefined);
      test(null);
      test(123);
      test(true);
      test({});
      test([]);

      // Stepped out of root (security)
      test('path:../foo');
      test('path:....../foo');
      test('path:foo/../../bar');
      test('path:foo/../../../bar');
    });
  });

  it('trimUriPrefix', () => {
    const test = (input: any, expected: string) => {
      expect(PathUri.trimUriPrefix(input)).to.eql(expected);
    };

    test('  ', '');
    test('', '');
    test('foo', 'foo');
    test('path:foo', 'foo');
    test('  path:foo  ', 'foo');
    test('  path:  foo  ', 'foo');
    test('  path:/foo/bar  ', '/foo/bar');

    test(null, '');
    test(123, '');
    test({}, '');
  });
});
