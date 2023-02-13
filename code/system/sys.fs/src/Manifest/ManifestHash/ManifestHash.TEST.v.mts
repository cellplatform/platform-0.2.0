import { expect, describe, it } from '../../test';
import { Hash, t } from '../common.mjs';
import { ManifestHash } from '.';

describe('ManifestHash', () => {
  const EMPTY = Hash.sha256([]);

  const testFile = (options: { path?: string; text?: string } = {}): t.ManifestFile => {
    const { path = 'dir/foo.txt', text = 'hello' } = options;
    const data = new TextEncoder().encode(text);
    const bytes = data.byteLength;
    const filehash = Hash.sha256(data);
    return { path, bytes, filehash };
  };

  const testFiles = (length: number) => {
    return Array.from({ length }).map((v, i) => {
      const path = `dir/file-${i + 1}.png`;
      const text = path;
      return testFile({ path, text });
    });
  };

  const expectHash = (value: string, expected: string) => {
    const message = `value: ${value} | expected end: ${expected}`;
    expect(value.endsWith(expected)).to.eql(true, message);
  };

  it('sha256', () => {
    const data = new TextEncoder().encode('hello');
    expect(ManifestHash.sha256(data)).to.eql(Hash.sha256(data));
  });

  describe('files', () => {
    it('empty', () => {
      const manifest: t.Manifest = { files: [], hash: { files: EMPTY } };
      expect(ManifestHash.files([])).to.eql(EMPTY);
      expect(ManifestHash.files(manifest)).to.eql(EMPTY);
    });

    it('single', () => {
      const file = testFile();
      const HASH = 'f8f24161c0aa47be5b626d';
      expectHash(ManifestHash.files([file]), HASH);
    });

    it('many (order agnostic)', () => {
      const files = testFiles(3);

      const res1 = ManifestHash.files(files);
      const res2 = ManifestHash.files([files[2], files[1], files[0]]);
      const res3 = ManifestHash.files([files[1], files[0], files[2]]);

      const HASH = '0abb667d5265ea3a75b0';

      expectHash(res1, HASH);
      expectHash(res2, HASH);
      expectHash(res3, HASH);
    });
  });

  describe('ModuleManifest', () => {
    const module: t.ModuleManifestInfo = {
      namespace: 'foo.bar',
      version: '1.2.3',
      compiler: `@platform/compiler@0.0.0`,
      compiledAt: 123456789,
      target: 'web',
      entry: 'index.html',
      remote: {
        entry: 'remoteEntry.js',
        exports: [],
      },
    };

    it('empty', () => {
      const res = ManifestHash.module(module, []);
      expectHash(res.files, EMPTY);
      expectHash(res.module, '8b0a9');
    });

    it('files', () => {
      const files = testFiles(5);
      const res = ManifestHash.module(module, files);
      expectHash(res.files, ManifestHash.files(files));
      expectHash(res.module, '84e64');
    });
  });

  describe('DirManifest', () => {
    const dir: t.DirManifestInfo = { indexedAt: 123456789 };

    it('empty', () => {
      const res = ManifestHash.dir(dir, []);
      expectHash(res.files, EMPTY);
      expectHash(res.dir, '0733adc460c49ae4f7f5ee');
    });

    it('files', () => {
      const files = testFiles(3);
      const res = ManifestHash.dir(dir, files);
      expectHash(res.files, ManifestHash.files(files));
      expectHash(res.dir, '935ec96422a121cdb');
    });
  });
});
