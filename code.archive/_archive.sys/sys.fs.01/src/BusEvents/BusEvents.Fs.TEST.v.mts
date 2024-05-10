import { ManifestFiles } from '../Manifest';
import { describe, expect, expectError, it, MemoryMock, TestPrep } from '../test';
import { DEFAULT, Hash, Json, t } from './common';

describe('BusEvents.Fs', () => {
  describe('sub-directory', () => {
    it('normalise "root" sub-directory', async () => {
      const mock = TestPrep();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', file.data);

      const test = async (dir: string) => {
        const fs = mock.events.fs(dir);
        const info = await fs.info('images/tree.png');
        expect(info.hash).to.eql(file.hash);
      };

      await test('');
      await test('  ');
      await test('/');
      await test('///');
      await test(' / ');
      await test(' // ');

      mock.dispose();
    });
  });

  describe('path', () => {
    it('join', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();

      const test = (input: string[], output: string) => {
        const res = fs.join(...input);
        expect(res).to.eql(output);
      };
      test(['foo', 'bar'], 'foo/bar');
      test(['', ''], '/');

      mock.dispose();
    });
  });

  describe('dir (sub-filesystem)', () => {
    it('deep', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:foo/bar/tree.png', file.data);

      const dir1 = fs.dir('foo');
      const dir2 = dir1.dir('bar');

      // NB: messy root directory scrubbed out
      const dir3 = fs.dir('');
      const dir4 = fs.dir('/');
      const dir5 = fs.dir(' /// ');

      expect(await fs.exists('foo/bar/tree.png')).to.eql(true);
      expect(await dir1.exists('tree.png')).to.eql(false);
      expect(await dir2.exists('tree.png')).to.eql(true);
      expect(await dir3.exists('foo/bar/tree.png')).to.eql(true);
      expect(await dir4.exists('foo/bar/tree.png')).to.eql(true);
      expect(await dir5.exists('foo/bar/tree.png')).to.eql(true);

      mock.dispose();
    });

    it('path variants', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:foo/bar/tree.png', file.data);

      const test = async (path: string, exists: boolean) => {
        const dir = fs.dir(path);
        expect(await dir.exists('tree.png')).to.eql(exists);
      };

      await test('foo/bar', true);
      await test('  foo/bar  ', true);
      await test('/foo/bar', true);
      await test('foo/bar/', true);
      await test('///foo/bar/', true);
      await test('  //foo/bar// ', true);
      await test('/', false);
      await test('/tree.png', false);

      mock.dispose();
    });

    it('sub-directory not specified', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:foo/bar/tree.png', file.data);

      const test = async (path: string) => {
        const dir = fs.dir(path);
        expect(await dir.exists('foo/bar/tree.png')).to.eql(true);
      };

      await test('');
      await test('  ');
      await test('/');
      await test(' / ');
      await test(' /// ');

      mock.dispose();
    });
  });

  describe('info', () => {
    it('file', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', file.data);

      const info = await fs.info('///images/tree.png');
      expect(info.exists).to.eql(true);
      expect(info.kind).to.eql('file');
      expect(info.path).to.eql('images/tree.png');
      expect(info.hash).to.eql(file.hash);
      expect(info.bytes).to.eql(file.data.byteLength);

      mock.dispose();
    });

    it('file (does not exist)', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const info = await fs.info('///images/tree.png');

      expect(info.exists).to.eql(false);
      expect(info.kind).to.eql('unknown');
      expect(info.path).to.eql('images/tree.png');
      expect(info.hash).to.eql('');
      expect(info.bytes).to.eql(-1);

      mock.dispose();
    });

    it('dir', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/foo/tree.png', file.data);

      const info = await fs.info('///images/foo/');
      expect(info.exists).to.eql(true);
      expect(info.kind).to.eql('dir');
      expect(info.path).to.eql('images/foo/');
      expect(info.hash).to.eql('');
      expect(info.bytes).to.eql(-1);

      mock.dispose();
    });

    it('within "sub/directory"', async () => {
      const mock = TestPrep();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', file.data);

      const fs1 = mock.events.fs();
      const fs2 = mock.events.fs('  images  ');

      const info1 = await fs1.info('///images/tree.png');
      const info2 = await fs2.info('  tree.png  ');

      expect(info1.exists).to.eql(true);
      expect(info1.hash).to.eql(file.hash);
      expect(info1.bytes).to.eql(file.data.byteLength);

      expect(info2.exists).to.eql(info1.exists);
      expect(info2.hash).to.eql(info1.hash);
      expect(info2.bytes).to.eql(info1.bytes);

      expect(info1.path).to.eql('images/tree.png');
      expect(info2.path).to.eql('tree.png');

      mock.dispose();
    });
  });

  describe('info: exists', () => {
    it('file: true', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:foo/bar.json', file.data);

      const test = async (path: string) => {
        const res = await fs.exists(path);
        expect(res).to.eql(true);
      };
      await test('foo/bar.json');
      await test('  /foo/bar.json  ');
      await test('  ///foo/bar.json  ');

      mock.dispose();
    });

    it('file: false', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();

      const test = async (path: any) => {
        const res = await fs.exists(path);
        expect(res).to.eql(false, path);
      };

      await test('foo/bar.json');
      await test(null);
      await test({});
      await test([]);

      mock.dispose();
    });

    it('dir', async () => {
      const mock = TestPrep();
      const file = MemoryMock.randomFile();
      const fs = mock.events.fs();
      await mock.driver.io.write('path:foo/bar/data.json', file.data);

      const test = async (path: any, exists: boolean) => {
        const res = await fs.exists(path);
        expect(res).to.eql(exists, path);
      };

      await test('foo', true);
      await test('/foo', true);
      await test('  foo/bar//  ', true);
      await test('foo/bar  ', true);

      await test('/', true); // NB: root dir.
      await test('./', true); // NB: root dir.
      await test('.', true); // NB: root dir.
      await test('   ', true); // NB: root dir.

      await test('zoo', false);
      await test(null, false);
      await test({}, false);
      await test([], false);

      mock.dispose();
    });

    it('within "sub/directory"', async () => {
      const mock = TestPrep();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', file.data);

      const root = mock.events.fs();
      const subdir = mock.events.fs('images');

      expect(await root.exists('images/tree.png')).to.eql(true);
      expect(await root.exists('tree.png')).to.eql(false);
      expect(await subdir.exists('tree.png')).to.eql(true);
      expect(await subdir.exists('///tree.png')).to.eql(true);
      expect(await subdir.exists('foo.png')).to.eql(false);

      mock.dispose();
    });
  });

  describe('info: is (flags)', () => {
    it('is.file', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', file.data);

      const test = async (path: string, expected: boolean) => {
        const res = await fs.is.file(path);
        expect(res).to.eql(expected);
      };

      await test('images/tree.png', true);
      await test('  //images/tree.png  ', true);
      await test('images', false);
      await test('', false);

      mock.dispose();
    });

    it('is.dir', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', file.data);

      const test = async (path: string, expected: boolean) => {
        const res = await fs.is.dir(path);
        expect(res).to.eql(expected);
      };

      await test('images', true);
      await test(' //images/  ', true);
      await test('/', true);
      await test('   ', true); // NB: root directory
      await test('images/tree.png', false);
      await test('  //images/tree.png  ', false);

      mock.dispose();
    });
  });

  describe('info: {manifest}', () => {
    it('read: no files (empty directory)', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const manifest = await fs.manifest();

      expect(manifest.files).to.eql([]); // NB: empty folder.
      mock.dispose();
    });

    it('read: files', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', file.data);
      await mock.driver.io.write('path:images/foo/tree.png', file.data);

      const manifest = await fs.manifest();

      const find = (path: string) => manifest.files.find((file) => file.path === path);
      const file1 = find('images/tree.png');
      const file2 = find('images/foo/tree.png');

      expect(manifest.files.length).to.eql(2);
      expect(file1?.path).to.eql('images/tree.png');
      expect(file2?.path).to.eql('images/foo/tree.png');
      expect(file1?.filehash).to.eql(file.hash);
      expect(file2?.filehash).to.eql(file.hash);

      mock.dispose();
    });

    it('read: fs.dir("child").manifest', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();

      await mock.driver.io.write('path:root.png', file.data);
      await mock.driver.io.write('path:images/tree.png', file.data);
      await mock.driver.io.write('path:images/foo/tree.png', file.data);

      const dir1 = fs.dir('images');
      const dir2 = dir1.dir('  //foo// ');

      const manifest1 = await fs.manifest();
      const manifest2 = await dir1.manifest();
      const manifest3 = await dir2.manifest();

      const paths = (manifest: t.DirManifest) =>
        ManifestFiles.sort(manifest.files).map((file) => file.path);

      expect(paths(manifest1)).to.eql(['images/foo/tree.png', 'images/tree.png', 'root.png']);
      expect(paths(manifest2)).to.eql(['foo/tree.png', 'tree.png']);
      expect(paths(manifest3)).to.eql(['tree.png']);

      mock.dispose();
    });

    it('sub-directory (parameter)', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();

      await mock.driver.io.write('path:root.png', file.data);
      await mock.driver.io.write('path:images/tree.png', file.data);
      await mock.driver.io.write('path:images/foo/tree.png', file.data);

      const manifest1 = await fs.manifest();
      const manifest2 = await fs.manifest({ dir: '  //images// ' });
      const manifest3 = await fs.dir('  //images//  ').manifest({ dir: ' //foo// ' });
      const manifest4 = await fs.dir('  //images//  ').manifest({ dir: ' //404// ' });
      const manifest5 = await fs.dir('  //404//  ').manifest();

      const paths = (manifest: t.DirManifest) =>
        ManifestFiles.sort(manifest.files).map((file) => file.path);

      expect(paths(manifest1)).to.eql(['images/foo/tree.png', 'images/tree.png', 'root.png']);
      expect(paths(manifest2)).to.eql(['images/foo/tree.png', 'images/tree.png']);
      expect(paths(manifest3)).to.eql(['foo/tree.png']);
      expect(paths(manifest4)).to.eql([]);
      expect(paths(manifest5)).to.eql([]);

      mock.dispose();
    });

    it('filter', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();

      await mock.driver.io.write('path:images/tree.png', file.data);
      await mock.driver.io.write('path:images/foo/willow.png', file.data);

      const manifest1 = await fs.manifest({ filter: (e) => e.path.endsWith('.txt') });
      const manifest2 = await fs.manifest({ filter: (e) => e.path.endsWith('/foo/willow.png') });

      expect(manifest1.files.length).to.eql(0);
      expect(manifest2.files.length).to.eql(1);
      expect(manifest2.files[0].path).to.eql('images/foo/willow.png');

      mock.dispose();
    });

    describe('cache', () => {
      it('cache: true', async () => {
        const mock = TestPrep();
        const fs = mock.events.fs();
        const file = MemoryMock.randomFile();
        await mock.driver.io.write('path:images/tree.png', file.data);

        // await fs.write('images/tree.png', src.data);
        const expectCacheExists = async (exists: boolean) => {
          const manifest = await fs.json.read(DEFAULT.CACHE_FILENAME);
          expect(Boolean(manifest)).to.eql(exists);
        };

        await fs.manifest();
        await expectCacheExists(false); // NB: no caching by default.

        await fs.manifest({ cache: false });
        await expectCacheExists(false);

        await fs.manifest({ cache: true });
        await expectCacheExists(true);

        mock.dispose();
      });

      it('cache: "remove"', async () => {
        const mock = TestPrep();
        const fs = mock.events.fs();
        const file = MemoryMock.randomFile();
        await mock.driver.io.write('path:images/tree.png', file.data);

        const expectCacheExists = async (exists: boolean) => {
          const manifest = await fs.json.read(DEFAULT.CACHE_FILENAME);
          expect(Boolean(manifest)).to.eql(exists);
        };

        await fs.manifest({ cache: true });
        await expectCacheExists(true);

        await fs.manifest({ cache: 'remove' });
        await expectCacheExists(false);

        mock.dispose();
      });

      it('cache: "force"', async () => {
        const mock = TestPrep();
        const fs = mock.events.fs();
        const file = MemoryMock.randomFile();
        await mock.driver.io.write('path:tree.png', file.data);

        const paths = (manifest?: t.DirManifest) =>
          ManifestFiles.sort((manifest?.files || []).map((file) => file.path));

        const readManifest = () => fs.json.read<t.DirManifest>(DEFAULT.CACHE_FILENAME);
        const readManifestPaths = async () => paths(await readManifest());
        const expectManifestPaths = async (paths: string[]) =>
          expect(await readManifestPaths()).to.eql(ManifestFiles.sort(paths));

        await expectManifestPaths([]);
        await fs.manifest({ cache: true });
        await expectManifestPaths(['tree.png']);

        await mock.driver.io.write('path:images/foo.png', file.data);

        // No change (filesystem changed BUT cached).
        await expectManifestPaths(['tree.png']);

        await fs.manifest();
        await expectManifestPaths(['tree.png']);

        await fs.manifest({ cache: false });
        await expectManifestPaths(['tree.png']);

        await fs.manifest({ cache: true });
        await expectManifestPaths(['tree.png']);

        // Force update.
        await fs.manifest({ cache: 'force' });
        await expectManifestPaths(['tree.png', 'images/foo.png']);

        await fs.manifest();
        await fs.manifest({ cache: true });
        await expectManifestPaths(['tree.png', 'images/foo.png']);

        mock.dispose();
      });

      it('cache: custom filename', async () => {
        const mock = TestPrep();
        const fs = mock.events.fs();
        const file = MemoryMock.randomFile();
        await mock.driver.io.write('path:tree.png', file.data);

        const cachefile = 'index.json';
        const paths = (manifest?: t.DirManifest) =>
          (manifest?.files || []).map((file) => file.path);

        const readManifest = () => fs.json.read<t.DirManifest>(cachefile);
        const readManifestPaths = async () => paths(await readManifest());
        const expectManifestPaths = async (paths: string[]) =>
          expect(await readManifestPaths()).to.eql(paths);

        expect(await readManifest()).to.eql(undefined);
        fs.manifest({ cachefile });

        expect(await readManifest()).to.eql(undefined);

        const res = await fs.manifest({ cachefile });
        await expectManifestPaths(['tree.png']);
        expect(paths(res)).to.eql(['tree.png']);

        await fs.manifest({ cachefile, cache: 'remove' });
        expect(await readManifest()).to.eql(undefined);

        mock.dispose();
      });
    });
  });

  describe('read', () => {
    it('<undefined> (does not exist)', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:tree.png', file.data);

      const res = await fs.read('404.png');
      expect(res).to.eql(undefined);

      mock.dispose();
    });

    it('binary: Uint8Array', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', file.data);

      const test = async (path: string) => {
        const res = await fs.read(path);
        expect(Hash.sha256(res)).to.eql(file.hash);
      };

      await test('/images/tree.png');
      await test('///images/tree.png');
      await test('  images/tree.png  ');
      await test('path:images/tree.png');
      await test('path:/images/tree.png');
      await test('  path:///images/tree.png  ');

      mock.dispose();
    });

    it('read within "/sub-directory"', async () => {
      const mock = TestPrep();
      const file = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', file.data);

      const test = async (dir: string, path: string) => {
        const fs = mock.events.fs({ dir });
        const res = await fs.read(path);
        expect(Hash.sha256(res)).to.eql(file.hash);
      };

      await test('images', '/tree.png');
      await test('  /images  ', '  tree.png  ');

      mock.dispose();
    });
  });

  describe('write', () => {
    it('write: binary file', async () => {
      const mock = TestPrep();

      const test = async (path: string) => {
        const mock = TestPrep();
        const fs = mock.events.fs();
        const src = MemoryMock.randomFile();

        const exists = async () => await mock.fileExists(path);
        expect(await exists()).to.eql(false); // Not yet copied.

        // Write.
        const res = await fs.write(path, src.data);
        expect(await exists()).to.eql(true); // Exists now.

        expect(res.hash).to.eql(src.hash);
        expect(res.bytes).to.eql(src.data.byteLength);
      };

      await test('images/tree.png');
      await test('  images/tree.png  ');
      await test('    /images/tree.png   ');

      mock.dispose();
    });

    describe('simple types (JSON primitives)', () => {
      const test = async (data: t.Json | undefined, expected: string) => {
        const mock = TestPrep();
        const fs = mock.events.fs();
        const uri = 'path:my-file';

        expect(await mock.fileExists(uri)).to.eql(false);
        const res = await fs.write(uri, data);
        expect(await mock.fileExists(uri)).to.eql(true);

        const file = (await mock.driver.io.read(uri)).file as t.FsDriverFile;
        const hash = Hash.sha256(file.data);
        expect(file.hash).to.eql(hash);
        expect(res.hash).to.eql(hash);

        const decoded = new TextDecoder().decode(file.data);
        expect(decoded).to.eql(expected);

        mock.dispose();
      };

      it('write: undefined', async () => await test(undefined, ''));
      it('write: null', async () => await test(null, 'null'));
      it('write: string', async () => await test('hello', 'hello'));
      it('write: number', async () => await test(1234, '1234'));

      it('write: boolean', async () => {
        await test(true, 'true');
        await test(false, 'false');
      });

      it('write: JSON [array]', async () => {
        const json = [1, 2, 3];
        await test(json, Json.stringify(json));
      });

      it('write: JSON {object}', async () => {
        const json = { msg: 'hello', count: 123 };
        await test(json, Json.stringify(json));
      });
    });

    it('write: within "/sub-directory"', async () => {
      const mock = TestPrep();
      const file = MemoryMock.randomFile();

      const root = mock.events.fs();
      const subdir = mock.events.fs('images');
      expect(await root.exists('images/foo.png')).to.eql(false);

      await subdir.write('foo.png', file.data);
      expect(await root.exists('images/foo.png')).to.eql(true);

      mock.dispose();
    });

    describe('errors', () => {
      it('throw on write: timeout', async () => {
        const mock = TestPrep();
        const fs = mock.events.fs({ timeout: 10 });
        const file = MemoryMock.randomFile();

        mock.controller.dispose(); // NB: Kill the controller so the operation times out.

        const fn = () => fs.write('foo.json', file.data);
        await expectError(fn, 'Timed out after 10 msecs');

        mock.dispose();
      });

      it('throw on write: attempt "step up" outside the root directory', async () => {
        const mock = TestPrep();
        const fs = mock.events.fs();
        const file = MemoryMock.randomFile();

        // Success.
        const res = await fs.write('data.json', file.data);
        expect(res.hash).to.eql(file.hash);

        // Fail (illegal path).
        const fn = () => fs.write('../../data.json', file.data);
        await expectError(fn, 'Failed while writing');

        mock.dispose();
      });
    });
  });

  describe('copy', () => {
    it('copy: binary', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const src = MemoryMock.randomFile();

      const PATH = {
        source: 'images/tree.png',
        target: 'images/foo.png',
      };

      await fs.write(PATH.source, src.data);
      expect(await fs.exists(PATH.target)).to.eql(false); // Not yet copied.

      await fs.copy(PATH.source, PATH.target);
      expect(await fs.exists(PATH.target)).to.eql(true);

      mock.dispose();
    });

    it('copy: "sub/directory"', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs('images');
      const file = MemoryMock.randomFile();

      const PATH = {
        source: 'tree.png',
        target: 'foo/bar.png',
      };
      await fs.write(PATH.source, file.data);
      await fs.copy(PATH.source, PATH.target);

      expect(await fs.exists(PATH.target)).to.eql(true);
      expect(await mock.fileExists('images/foo/bar.png')).to.eql(true);

      mock.dispose();
    });
  });

  describe('move', () => {
    it('move: binary', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs('images');
      const file = MemoryMock.randomFile();

      const PATH = {
        source: 'images/tree.png',
        target: 'images/foo.png',
      };

      await fs.write(PATH.source, file.data);
      expect(await fs.exists(PATH.source)).to.eql(true);
      expect(await fs.exists(PATH.target)).to.eql(false);

      await fs.move(PATH.source, PATH.target);
      expect(await fs.exists(PATH.source)).to.eql(false);
      expect(await fs.exists(PATH.target)).to.eql(true);

      mock.dispose();
    });

    it('move: "sub/directory"', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs('images');
      const file = MemoryMock.randomFile();

      const PATH = {
        source: 'tree.png',
        target: 'foo/bar.png',
      };

      await fs.write(PATH.source, file.data);
      await fs.move(PATH.source, PATH.target);

      expect(await mock.fileExists('images/tree.png')).to.eql(false);
      expect(await mock.fileExists('images/foo/bar.png')).to.eql(true);

      mock.dispose();
    });
  });

  describe('delete', () => {
    it('delete: binary', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const file = MemoryMock.randomFile();
      const path = 'images/tree.png';

      await fs.write(path, file.data);
      expect(await fs.exists(path)).to.eql(true);

      await fs.delete(path);
      expect(await fs.exists(path)).to.eql(false);

      mock.dispose();
    });

    it('delete: "sub/directory"', async () => {
      const mock = TestPrep();
      const src = MemoryMock.randomFile();

      const fs1 = mock.events.fs();
      const fs2 = mock.events.fs('images');

      const path1 = 'images/tree.png';
      const path2 = 'tree.png';

      await fs1.write(path1, src.data);
      expect(await fs1.exists(path1)).to.eql(true);
      expect(await fs2.exists(path2)).to.eql(true);

      await fs2.delete(path2);
      expect(await fs1.exists(path1)).to.eql(false);
      expect(await fs2.exists(path2)).to.eql(false);

      mock.dispose();
    });
  });

  describe('json', () => {
    const test = async (data: t.Json) => {
      const mock = TestPrep();
      const fs = mock.events.fs();

      const path = 'path:foo/data.json';
      const write = await fs.json.write(path, data);
      const file = (await mock.driver.io.read(path)).file;

      const read = await fs.json.read(path);
      expect(write.hash).to.eql(file?.hash);
      expect(read).to.eql(data);

      mock.dispose();
    };

    it('read: not found (undefined)', async () => {
      const mock = TestPrep();
      const fs = mock.events.fs();
      const res = await fs.json.read('404.json');
      expect(res).to.eql(undefined);
      mock.dispose();
    });

    describe('write => read', () => {
      it('{object}', async () => {
        await test({});
        await test({ msg: 'hello' });
      });

      it('[array]', async () => {
        await test([]);
        await test([1, 2, 3]);
        await test([1, { msg: 'hello' }, true]);
      });

      it('boolean', async () => {
        await test(true);
        await test(false);
      });

      it('number', async () => {
        await test(0);
        await test(1234);
        await test(-999);
      });

      it('string', async () => {
        await test('   Hello   ');
        await test('');
      });

      it('null', async () => {
        await test(null);
      });
    });

    describe('errors', () => {
      it('throw: write undefined', async () => {
        const fn = () => test(undefined as any);
        expectError(fn, 'JSON cannot be undefined');
      });
    });
  });
});
