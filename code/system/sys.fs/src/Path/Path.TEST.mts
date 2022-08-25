import { expect } from '../TEST/index.mjs';
import { Path } from './index.mjs';
import { PathUri } from '../PathUri/index.mjs';

describe('Path', () => {
  it('Uri', () => {
    expect(Path.Uri).to.equal(PathUri);
  });

  it('join', () => {
    const test = (parts: string[], expected: string) => {
      const res = Path.join(...parts);
      expect(res).to.eql(expected);
    };

    test([], '');
    test(['foo'], 'foo');
    test(['/foo'], '/foo');
    test(['foo/'], 'foo/');
    test(['/foo/'], '/foo/');
    test(['foo/', '/bar'], 'foo/bar');
    test(['foo///', '///bar'], 'foo/bar');
    test(['/foo///', '///bar/'], '/foo/bar/');
    test(['foo/bar'], 'foo/bar');
    test(['foo/bar', 'baz'], 'foo/bar/baz');
    test(['foo/bar/', 'baz/', '/boo/'], 'foo/bar/baz/boo/');

    test(['foo/./bar', 'baz/'], 'foo/bar/baz/');

    test(['foo/./bar'], 'foo/bar');
    test(['foo/../bar'], 'bar');
    test(['foo/../../bar'], '');
    test(['foo/../../.././../bar'], '');
    test(['.'], '');
    test(['..'], '');
    test(['../../.././../bar'], '');
    test(['foo/bar/baz', '../.././zoo'], 'foo/zoo');
  });

  describe('trim', () => {
    it('trimSlashes', () => {
      const test = (input: any, expected: string) => {
        expect(Path.trimSlashes(input)).to.eql(expected);
      };

      test('', '');
      test('  ', '');

      test('/', '');
      test('  /  ', '');
      test('/foo/', 'foo');
      test('  /  foo/bar  /  ', 'foo/bar');

      test(null, '');
      test(undefined, '');
      test(123, '');
      test([123], '');
      test({}, '');
    });

    it('trimSlashesStart', () => {
      const test = (input: any, expected: string) => {
        expect(Path.trimSlashesStart(input)).to.eql(expected);
      };

      test('/', '');
      test('  /  ', '');
      test('foo', 'foo');
      test('/foo', 'foo');
      test('/  foo', 'foo');
      test('  /  foo', 'foo');
      test('/foo/bar  ', 'foo/bar');
      test('/foo/bar/', 'foo/bar/');
      test('/foo/bar /', 'foo/bar /');
    });

    it('trimSlashesEnd', () => {
      const test = (input: any, expected: string) => {
        expect(Path.trimSlashesEnd(input)).to.eql(expected);
      };

      test('/', '');
      test('  /  ', '');
      test('foo', 'foo');
      test('/foo', '/foo');
      test('/foo/  ', '/foo');
      test('/foo  /  ', '/foo');
    });

    it('ensureSlashEnd', () => {
      const test = (input: any, expected: string) => {
        expect(Path.ensureSlashEnd(input)).to.eql(expected);
      };

      test('foo', 'foo/');
      test('   /foo   ', '/foo/');
      test('/', '/');
      test('', '/');
      test('   ', '/');
      test('///', '/');
      test('foo/bar///', 'foo/bar/');
    });

    it('trimHttp', () => {
      const test = (input: any, expected: string) => {
        expect(Path.trimHttp(input)).to.eql(expected);
      };

      test('   ', '');
      test('foo', 'foo');
      test('  /foo/', '/foo/');

      test('http:/foo', 'http:/foo');
      test('https:/foo', 'https:/foo');
      test('http//foo', 'http//foo');

      test('  http://foo  ', 'foo');
      test('  https://foo/bar  ', 'foo/bar');

      test(null, '');
      test(undefined, '');
      test(123, '');
      test([123], '');
      test({}, '');
    });

    it('trimWildcardEnd', () => {
      const test = (input: any, expected: string) => {
        expect(Path.trimWildcardEnd(input)).to.eql(expected);
      };

      test('', '');
      test('  ', '');
      test('/', '/');
      test('  /  ', '/');

      test('/*', '/');
      test('/foo/*', '/foo/');
      test('/foo/**', '/foo/');
      test('/foo/**/*', '/foo/');
      test('/foo/**/**', '/foo/');

      test('*', '');
      test('*/*', '');
      test('**/*', '');

      test(null, '');
      test(undefined, '');
      test(123, '');
      test([123], '');
      test({}, '');
    });
  });

  describe('parts', () => {
    it('empty', () => {
      const test = (input?: string) => {
        const res = Path.parts(input as any);

        expect(res.dir).to.eql('');
        expect(res.filename).to.eql('');
        expect(res.name).to.eql('');
        expect(res.ext).to.eql('');
        expect(res.path).to.eql('');
      };

      test('');
      test('   ');
      test(undefined);
    });

    it('path: "file.txt"', () => {
      const path = 'file.txt';
      const res = Path.parts(path);
      expect(res.path).to.eql(path);
      expect(res.dir).to.eql('');
      expect(res.filename).to.eql('file.txt');
      expect(res.name).to.eql('file');
      expect(res.ext).to.eql('txt');
    });

    it('path: "/file.txt"', () => {
      const path = '/file.txt';
      const res = Path.parts(path);
      expect(res.path).to.eql(path);
      expect(res.dir).to.eql('');
      expect(res.filename).to.eql('file.txt');
      expect(res.name).to.eql('file');
      expect(res.ext).to.eql('txt');
    });

    it('path: "//foo/file.foo.txt"', () => {
      const path = '//foo/file.foo.txt';
      const res = Path.parts(`  ${path}  `);
      expect(res.path).to.eql(path);
      expect(res.dir).to.eql('//foo');
      expect(res.filename).to.eql('file.foo.txt');
      expect(res.name).to.eql('file.foo');
      expect(res.ext).to.eql('txt');
    });

    it('path: "foo"', () => {
      const path = 'foo';
      const res = Path.parts(`  ${path}  `);
      expect(res.path).to.eql(path);
      expect(res.dir).to.eql('');
      expect(res.filename).to.eql('foo');
      expect(res.name).to.eql('foo');
      expect(res.ext).to.eql('');
    });

    it('path: "." (edge case)', () => {
      const path = '.';
      const res = Path.parts(`  ${path}  `);
      expect(res.path).to.eql(path);
      expect(res.dir).to.eql('');
      expect(res.filename).to.eql('.');
      expect(res.name).to.eql('');
      expect(res.ext).to.eql('');
    });
  });

  describe('to... (conversion)', () => {
    it('toAbsolute', () => {
      const test = (path: string, root: string, expected: string) => {
        const res1 = Path.toAbsolutePath({ path, root });
        const res2 = Path.toAbsoluteLocation({ path, root });
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
        const res1 = Path.toRelativePath({ path, root });
        const res2 = Path.toRelativeLocation({ path, root });
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
});
