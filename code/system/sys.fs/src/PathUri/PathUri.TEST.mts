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
      expect(PathUri.path(input)).to.eql(expectedPath);
    };

    test('', undefined);
    test('foo/bar', undefined);
    test(null, undefined);
    test({}, undefined);

    test('path:foo/bar', 'foo/bar');
    test('  path:foo/bar  ', 'foo/bar');
    test('path:///foo/bar', 'foo/bar');
    test('path:foo/bar/', 'foo/bar/');

    test('path:', '');
    test('  path:  ', '');

    test('path:./foo', 'foo');
    test('path:../foo', '');
    test('path:....../foo', 'foo');
    test('path:foo/../bar', 'bar');
    test('path:foo/../../bar', ''); // NB: Stepped up and out of scope.
    test('path:foo/../../../bar', ''); // NB: Stepped up and out of scope.
    test('path:foo/bar/../zoo', 'foo/zoo');
  });

  it('ensureUriPrefix | cleanPath', () => {
    const test = (input: any, expected: string) => {
      const res = PathUri.ensureUriPrefix(input);
      expect(res).to.eql(expected, input);

      // NB: Test secondary method ("cleanPath") that is used within the [ensureUriPrefix] method.
      const trimAndClean = (input: string) => PathUri.cleanPath(PathUri.trimUriPrefix(input));
      expect(trimAndClean(res)).to.eql(trimAndClean(expected));
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

    test('foo/bar', 'path:foo/bar');
    test('/foo/bar', 'path:/foo/bar');
    test('  /foo/bar/  ', 'path:/foo/bar/');
    test('///foo/bar/  ', 'path:/foo/bar/');

    test(undefined, '');
    test(null, '');
    test(123, '');
    test(true, '');
    test({}, '');
    test([], '');
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
