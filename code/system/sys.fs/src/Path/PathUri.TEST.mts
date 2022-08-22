import { expect } from 'chai';
import { PathUri } from './index.mjs';

describe('PathUri', () => {
  it('prefix', () => {
    expect(PathUri.prefix).to.eql('path');
  });

  it('is', () => {
    const test = (input: any, expected: boolean) => {
      expect(PathUri.is(input)).to.eql(expected);
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

  it('ensurePrefix', () => {
    const test = (input: any, expected: string) => {
      expect(PathUri.ensurePrefix(input)).to.eql(expected);
    };

    test('  ', 'path:');
    test('path:foo', 'path:foo');
    test('  path:foo/bar  ', 'path:foo/bar');
    test('  foo  ', 'path:foo');
    test('  /foo/bar/  ', 'path:/foo/bar/');
    test('foo/bar', 'path:foo/bar');

    test(null, '');
    test(123, '');
    test({}, '');
  });

  it('trimPrefix', () => {
    const test = (input: any, expected: string) => {
      expect(PathUri.trimPrefix(input)).to.eql(expected);
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
