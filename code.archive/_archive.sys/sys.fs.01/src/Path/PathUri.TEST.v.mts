import { describe, expect, it } from '../test';
import { PathUri } from '.';

describe('PathUri', () => {
  it('prefix', () => {
    expect(PathUri.prefix).to.eql('path');
  });

  it('isPathUri', () => {
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
    test(undefined, false);
    test({}, false);
    test([], false);
    test(true, false);
    test(1234, false);
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

  it('trimUriPrefix', () => {
    const test = (input: any, expected: string) => {
      expect(PathUri.trimUriPrefix(input)).to.eql(expected, input);
    };

    test('  ', '');
    test('', '');
    test('foo', 'foo');
    test('path:foo', 'foo');
    test('  path:foo  ', 'foo');
    test('  path:  foo  ', 'foo');
    test('  path:/foo/bar  ', '/foo/bar');

    test(undefined, '');
    test(null, '');
    test(123, '');
    test(true, '');
    test({}, '');
    test([], '');
  });

  describe('ensureUriPrefix', () => {
    it('input variants', () => {
      const test = (input: any, expected: string) => {
        const uri = PathUri.ensureUriPrefix(input);
        expect(uri.startsWith('path:')).to.eql(true, input);
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

    it('invalid input - not a string', () => {
      const test = (input: any) => {
        expect(PathUri.ensureUriPrefix(input)).to.eql('', input); // NB: no "throw" option.
        const fn = () => PathUri.ensureUriPrefix(input, { throw: true });
        expect(fn).to.throw(/Invalid input/);
      };

      test(undefined);
      test(null);
      test(123);
      test(true);
      test({});
      test([]);
    });

    it('invalid input - stepped out of root (security)', () => {
      const test = (input: any) => {
        expect(PathUri.ensureUriPrefix(input)).to.eql('', input); // NB: no "throw" option.
        const fn = () => PathUri.ensureUriPrefix(input, { throw: true });
        expect(fn).to.throw(/Invalid input/);
      };

      // Stepped out of root (security)
      test('path:../foo');
      test('path:....../foo');
      test('path:foo/../../bar');
      test('path:foo/../../../bar');
    });
  });

  describe('resolve', () => {
    it('resolve', () => {
      const test = (root: string, uri: string, expected: string) => {
        const res = PathUri.resolve(root, uri);
        expect(res).to.eql(expected, uri);
      };

      test('/root', 'path:foo', '/root/foo');
      test('/root', 'path:/foo', '/root/foo');
      test('/root', 'path:///foo', '/root/foo');
      test('/root', '  path:foo/bar  ', '/root/foo/bar');
      test('/root', '  path:   foo/bar  ', '/root/foo/bar');

      test('/root', 'path:', '/root/');
      test('/root', 'path:/', '/root/');
      test('/root', 'path:.', '/root/');
      test('/root', 'path:///', '/root/');
      test('/root', 'path:./foo', '/root/foo');

      test('root', 'path:.', '/root/');
      test('/root/', 'path:.', '/root/');
      test('  /root/  ', 'path:.', '/root/');
      test('  ///root///  ', 'path:/foo', '/root/foo');
      test('  ///root///  ', 'path:  /foo  ', '/root/foo');
    });

    it('resolve (/.)', async () => {
      expect(PathUri.resolve('/', 'path:.')).to.eql('/');
    });

    it('throw: root directory not specified', () => {
      const test = (dir: string) => {
        const fn = () => PathUri.resolve(dir, 'path:foo');
        expect(fn).to.throw(/Path resolver must have root directory/);
      };
      test('');
      test('  ');
    });

    it('throw: invalid input', async () => {
      const test = (input: any) => {
        const fn = () => PathUri.resolve('/root/foo', input);
        expect(fn).to.throw(/URI should start with \"path\:/);
      };

      test('/foo/bar');
      test(null);
      test(undefined);
      test(1234);
      test({});
      test([]);
    });

    it('throw: stepping out of root directory scope (security) ', () => {
      const dir = '/root';

      const test = (uri: string) => {
        const fn = () => PathUri.resolve(dir, uri);
        expect(fn).to.throw(/Path out of scope of root directory/, uri);
      };

      test('path:../foo');
      test('path:foo/../../bar');
      test('path:./foo/../..');
      test('path:./foo/../../../../../../../');
    });

    it('resolver (factory)', () => {
      const resolve = PathUri.resolver('  foo/bar  ');

      expect(resolve('path:file.txt')).to.eql('/foo/bar/file.txt');
      expect(resolve('path:./images/bird.png')).to.eql('/foo/bar/images/bird.png');

      const fn = () => resolve('file.txt'); // NB: not a "path:uri"
      expect(fn).to.throw(/URI should start with \"path\:/);
    });
  });

  describe('unpack', () => {
    it('no root directory', () => {
      const res = PathUri.unpack('  path:foo/bar  ');

      expect(res.uri).to.eql('path:foo/bar');
      expect(res.root).to.eql('/');
      expect(res.path).to.eql('/foo/bar');
      expect(res.fullpath).to.eql('/foo/bar');
      expect(res.location).to.eql('file:///foo/bar');
      expect(res.withinScope).to.eql(true);
      expect(res.rawpath).to.eql('foo/bar');
      expect(res.error).to.eql(undefined);
    });

    it('root directory', () => {
      const res = PathUri.unpack('path://foo/bar', { root: '  base ' });

      expect(res.uri).to.eql('path:/foo/bar');
      expect(res.root).to.eql('/base/');
      expect(res.path).to.eql('/foo/bar');
      expect(res.fullpath).to.eql('/base/foo/bar');
      expect(res.location).to.eql('file:///base/foo/bar');
      expect(res.withinScope).to.eql(true);
      expect(res.rawpath).to.eql('//foo/bar');
      expect(res.error).to.eql(undefined);
    });

    it('throw: not a "path:.." uri', () => {
      const fn = () => PathUri.unpack('foo/bar');
      expect(fn).to.throw(/Should start with \"path:\.\.\"/);
    });

    it('error: out of scope', () => {
      const res1 = PathUri.unpack('path:../foo');
      const res2 = PathUri.unpack('path:../foo/', { root: 'base' });

      expect(res1.withinScope).to.eql(false);
      expect(res2.withinScope).to.eql(false);

      expect(res1.error).to.include('Path out of scope');
      expect(res2.error).to.include('Path out of scope');

      expect(res1.uri).to.eql('path:../foo');
      expect(res2.uri).to.eql('path:../foo/');

      expect(res1.rawpath).to.eql('../foo');
      expect(res2.rawpath).to.eql('../foo/');

      expect(res1.root).to.eql('/');
      expect(res2.root).to.eql('/base/');

      expect(res1.path).to.eql('');
      expect(res2.path).to.eql('');

      expect(res1.location).to.eql('');
      expect(res2.location).to.eql('');
    });

    it('unpacker (factory)', () => {
      const unpacker1 = PathUri.unpacker();
      const unpacker2 = PathUri.unpacker('/root');

      const res1 = unpacker1('path:foo');
      const res2 = unpacker2('path:foo');

      expect(res1.uri).to.eql('path:foo');
      expect(res2.uri).to.eql('path:foo');

      expect(res1.root).to.eql('/');
      expect(res2.root).to.eql('/root/');

      expect(res1.path).to.eql('/foo');
      expect(res2.path).to.eql('/foo');

      expect(res1.fullpath).to.eql('/foo');
      expect(res2.fullpath).to.eql('/root/foo');
    });
  });
});
