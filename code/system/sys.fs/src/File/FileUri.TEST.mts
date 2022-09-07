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
});
