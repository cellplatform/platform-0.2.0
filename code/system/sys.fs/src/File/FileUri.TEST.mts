import { describe, it, expect } from '../TEST/index.mjs';
import { FileUri } from './index.mjs';

describe('FileUri', () => {
  it('prefix', () => {
    FileUri.prefix === 'file';
  });

  it('isFileUri', async () => {
    const test = (input: any, expected: boolean) => {
      expect(FileUri.isFileUri(input)).to.eql(expected);
    };

    test('file:foo/bar.txt', true);
    test('  file:foo/bar.txt  ', true);

    test('path:foo:123', false);
    test('  path:foo:123  ', false);
    test('', false);
    test('/foo', false);

    test(null, false);
    test(undefined, false);
    test({}, false);
    test([], false);
    test(true, false);
    test(1234, false);
  });

  it('trimUriPrefix', () => {
    const test = (input: any, expected: string) => {
      expect(FileUri.trimUriPrefix(input)).to.eql(expected, input);
    };

    test('  ', '');
    test('', '');
    test('foo', 'foo');
    test('file:foo', 'foo');
    test('  file:foo  ', 'foo');
    test('  file:  foo  ', 'foo');
    test('  file:/foo/bar  ', '/foo/bar');

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
        const uri = FileUri.ensureUriPrefix(input);
        expect(uri).to.eql(expected, input);
      };

      test('', 'file:/');
      test('  ', 'file:/');
      test('file:', 'file:/');
      test(' file: ', 'file:/');

      test('.', 'file:/');
      test(' . ', 'file:/');
      test(' ./ ', 'file:/');
      test(' ./// ', 'file:/');
      test('file:.', 'file:/');
      test('file:./', 'file:/');

      test('path', 'file:path'); // NB: not a URI prefix.
      test('file:foo', 'file:foo');
      test('  file:foo/bar  ', 'file:foo/bar');
      test('  file:/foo/bar.png  ', 'file:/foo/bar.png');
      test('  foo  ', 'file:foo');

      test('./foo', 'file:foo'); // NB: relative root
      test('foo/bar', 'file:foo/bar');
      test('/foo/bar', 'file:/foo/bar');
      test('  /foo/bar/  ', 'file:/foo/bar/');
      test('///foo/bar/  ', 'file:/foo/bar/');

      test('.manifest.json', 'file:.manifest.json');
      test('.file ', 'file:.file');
      test(' .filename.yaml ', 'file:.filename.yaml');

      test('file:./foo', 'file:foo');
      // test('file:foo/../bar', 'file:bar');
      // test('file:foo/bar/../zoo', 'file:foo/zoo');
    });

    it('invalid input - not a string', () => {
      const test = (input: any) => {
        expect(FileUri.ensureUriPrefix(input)).to.eql('', input); // NB: no "throw" option.
        const fn = () => FileUri.ensureUriPrefix(input, { throw: true });
        expect(fn).to.throw(/Invalid input/);
      };

      test(undefined);
      test(null);
      test(123);
      test(true);
      test({});
      test([]);
    });

    it('throw: path contains any step-ups ("..")', () => {
      const test = (input: any) => {
        expect(FileUri.ensureUriPrefix(input)).to.eql('', input); // NB: no "throw" option.
        const fn = () => FileUri.ensureUriPrefix(input, { throw: true });
        expect(fn).to.throw(/Invalid input/);
      };

      test('file:..');
      test('file:../');
      test('file:../foo');

      test('file:foo/../bar');
      test('file:foo/../');
      test('file:foo/..');
    });
  });
});
