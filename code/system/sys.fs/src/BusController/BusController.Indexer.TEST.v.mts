import { describe, it, DEFAULT, expect, Hash, t, TestPrep, MemoryMock } from '../test';

import { ManifestFiles } from '../Manifest';
import { Path } from './common';

describe('BusController.Indexer', function () {
  type R = t.FsBusManifestDirResponse;
  const asFiles = (dir: R) => ManifestFiles.sort(dir.manifest.files.map((file) => file.path));

  describe('manifest', () => {
    it('empty', async () => {
      const mock = TestPrep();
      const res = await mock.events.index.manifest.get();

      const item = res.dirs[0];
      const manifest = item.manifest;
      expect(res.dirs.length).to.eql(1);

      expect(item.dir).to.eql(mock.dir);
      expect(manifest.kind).to.eql('dir');
      expect(typeof manifest.dir.indexedAt === 'number').to.eql(true);
      expect(manifest.files).to.eql([]);
      expect(manifest.hash.files).to.eql(Hash.sha256([]));

      mock.dispose();
    });

    it('root (no "dir" parameter passed)', async () => {
      const mock = TestPrep();
      const io = mock.events.io;

      const src1 = MemoryMock.randomFile();
      const src2 = MemoryMock.randomFile();

      const path1 = 'path:/foo/data.json';
      const path2 = 'path:/bar/tree.png';

      await io.write.fire({ path: path1, hash: src1.hash, data: src1.data });
      await io.write.fire({ path: path2, hash: src2.hash, data: src2.data });

      const res = await mock.events.index.manifest.get();
      const item = res.dirs[0];
      const manifest = item.manifest;

      expect(res.dirs.length).to.eql(1);
      expect(item.dir).to.eql(mock.dir);
      expect(manifest.kind).to.eql('dir');
      expect(typeof manifest.dir.indexedAt === 'number').to.eql(true);

      const files = manifest.files;
      expect(files.length).to.eql(2);
      expect(files.map(({ path }) => path)).to.eql(['bar/tree.png', 'foo/data.json']);

      mock.dispose();
    });

    it('empty "dir" param variants (return root)', async () => {
      const mock = TestPrep();
      const io = mock.events.io;
      const src = MemoryMock.randomFile();

      const write = (path: string) => io.write.fire({ path, hash: src.hash, data: src.data });
      await write('/root.json');
      await write('/data/foo/data.json');
      await write('/data/foo/child/list.json');
      const all = ['data/foo/child/list.json', 'data/foo/data.json', 'root.json'];

      const test = async (dir: string | string[]) => {
        const res = await mock.events.index.manifest.get({ dir });
        expect(res.dirs.length).to.eql(1);
        expect(asFiles(res.dirs[0])).to.eql(all);
      };
      await test('');
      await test('  ');
      await test('/');
      await test('  /  ');
      await test([]);
      await test(['']);
      await test(['  ']);
      await test(['/']);
      await test([' / ']);
      await test(['', '   ', '']);
      await test(['/', '', '  /  ', ' ']);

      mock.dispose();
    });

    it('multiple sub-trees', async () => {
      const mock = TestPrep();
      const io = mock.events.io;
      const src = MemoryMock.randomFile();

      const write = (path: string) => io.write.fire({ path, hash: src.hash, data: src.data });
      await write('/root.json');
      await write('/data/foo/data.json');
      await write('/data/foo/child/list.json');
      await write('/logs/archive/main.log');
      await write('/logs/main.log');
      const all = [
        'data/foo/child/list.json',
        'data/foo/data.json',
        'logs/archive/main.log',
        'logs/main.log',
        'root.json',
      ];

      const dir = ['  ', '/', '    /data/foo  ', '  logs  ', '/404'];
      const res = await mock.events.index.manifest.get({ dir });

      const files1 = asFiles(res.dirs[0]);
      const files2 = asFiles(res.dirs[1]);
      const files3 = asFiles(res.dirs[2]);
      const files4 = asFiles(res.dirs[3]);
      expect(files1).to.eql(all); // NB: The first two parameter entries collapse into a single index (the "root")
      expect(files2).to.eql(['data/foo/child/list.json', 'data/foo/data.json']);
      expect(files3).to.eql(['logs/archive/main.log', 'logs/main.log']);
      expect(files4).to.eql([]);

      mock.dispose();
    });

    it('hash comparison (SHA256)', async () => {
      const mock = TestPrep();
      const io = mock.events.io;
      const src1 = MemoryMock.randomFile();
      const src2 = MemoryMock.randomFile();
      const path1 = 'foo/data.json';
      const path2 = 'bar/tree.png';

      await io.write.fire({ path: path1, hash: src1.hash, data: src1.data });
      await io.write.fire({ path: path2, hash: src2.hash, data: src2.data });

      const res = await mock.events.index.manifest.get();
      const manifest = res.dirs[0].manifest;

      const find = (path: string) => manifest.files.find((file) => file.path === path);
      const file1 = find(path1);
      const file2 = find(path2);

      expect(file1?.filehash).to.eql(src1.hash);
      expect(file2?.filehash).to.eql(src2.hash);

      mock.dispose();
    });
  });

  describe('manifest caching', () => {
    const cachePrep = async () => {
      const mock = TestPrep();
      const io = mock.events.io;
      const src = MemoryMock.randomFile();

      const write = (path: string) => io.write.fire({ path, hash: src.hash, data: src.data });
      await write('path:/root.json');
      await write('path:/data/bar/list.json');
      await write('path:/data/foo/data.json');
      const all = ['data/bar/list.json', 'data/foo/data.json', 'root.json'];

      const cachefilename = DEFAULT.CACHE_FILENAME;
      // const cachefileUri =

      const loadCachedFile = async (filename?: string) => {
        const cachefile = Path.join(filename ?? DEFAULT.CACHE_FILENAME);
        const uri = Path.Uri.ensureUriPrefix(cachefile);
        const res = await mock.driver.io.read(uri);
        if (!res.file) return undefined;

        const text = new TextDecoder().decode(res.file.data);
        return JSON.parse(text);
      };

      return { mock, all, cachefilename, loadCachedFile };
    };

    it('no caching - default', async () => {
      const { mock, all, cachefilename: cachefile } = await cachePrep();
      const test = async (cache: boolean | undefined) => {
        expect(await mock.fileExists(cachefile)).to.eql(false);
        const res = await mock.events.index.manifest.get({ cache });
        const files = asFiles(res.dirs[0]);
        expect(files).to.eql(all);
      };
      await test(undefined);
      await test(false);

      mock.dispose();
    });

    it('cache:true (uses cache)', async () => {
      const { mock, all, cachefilename, loadCachedFile } = await cachePrep();

      expect(await loadCachedFile()).to.eql(undefined);
      const res1 = await mock.events.index.manifest.get({ cache: true });

      expect(asFiles(res1.dirs[0])).to.eql(all);
      expect(await mock.fileExists(cachefilename)).to.eql(true);
      expect(await loadCachedFile()).to.eql(res1.dirs[0].manifest);

      // Manipulate the cached file to test if it's used.
      // NB: This should never be done in the wild!
      const json = await loadCachedFile();
      (json?.files[0] as any).foobar = 'my-test';
      await mock.driver.io.write(
        Path.Uri.ensureUriPrefix(cachefilename),
        new TextEncoder().encode(JSON.stringify(json)),
      );

      // Requery and ensure the cached version is returned.
      const res2 = await mock.events.index.manifest.get({ cache: true });
      expect((res2.dirs[0].manifest.files[0] as any).foobar).to.eql('my-test');

      mock.dispose();
    });

    it('cache: "force"', async () => {
      const { mock, cachefilename, loadCachedFile } = await cachePrep();
      expect(await loadCachedFile()).to.eql(undefined);
      const res1 = await mock.events.index.manifest.get({ cache: true });
      expect((res1.dirs[0].manifest.files[0] as any).foobar).to.eql(undefined);

      // Manipulate the cached file to test if it's used.
      const json = await loadCachedFile();
      (json?.files[0] as any).foobar = 'my-test';
      await mock.driver.io.write(
        Path.Uri.ensureUriPrefix(cachefilename),
        new TextEncoder().encode(JSON.stringify(json)),
      );

      // Requery and ensure the cached version is returned.
      const res2 = await mock.events.index.manifest.get({ cache: true });
      expect((res2.dirs[0].manifest.files[0] as any).foobar).to.eql('my-test');

      // Query again and "force".
      const res3 = await mock.events.index.manifest.get({ cache: 'force' });
      expect((res3.dirs[0].manifest.files[0] as any).foobar).to.eql(undefined);
      expect(await loadCachedFile()).to.eql(res3.dirs[0].manifest);

      mock.dispose();
    });

    it('cache: "remove"', async () => {
      const { mock, loadCachedFile } = await cachePrep();
      const manifest = mock.events.index.manifest;
      expect(await loadCachedFile()).to.eql(undefined);

      await manifest.get({ cache: true });
      expect((await loadCachedFile())?.kind).to.eql('dir');

      const res = await manifest.get({ cache: 'remove' });
      const rootJson = res.dirs[0].manifest.files.find((item) => item.path === 'root.json');
      expect(rootJson?.path).to.eql('root.json');

      // NB: Ensure the "remove" flag caused the file to be cleared.
      expect(await loadCachedFile()).to.eql(undefined);

      // NB: Ensure repeat calls (when cache does not exist) do not fail.
      await manifest.get({ cache: 'remove' });
      await manifest.get({ cache: 'remove' });
      await manifest.get({ cache: 'remove' });

      mock.dispose();
    });

    it('cache: "remove" (custom filename)', async () => {
      const { mock, loadCachedFile } = await cachePrep();
      const manifest = mock.events.index.manifest;
      const cachefile = 'index.json';

      expect(await loadCachedFile(cachefile)).to.eql(undefined);

      await manifest.get({ cache: true, cachefile });
      expect((await loadCachedFile(cachefile))?.kind).to.eql('dir');

      // NB: Ensure the "remove" flag causes the file to be cleared.
      await manifest.get({ cache: 'remove', cachefile });
      expect(await loadCachedFile(cachefile)).to.eql(undefined);

      mock.dispose();
    });

    it('does not include cached ".dir" file within manifest', async () => {
      const { mock, loadCachedFile } = await cachePrep();
      expect(await loadCachedFile()).to.eql(undefined);

      const res1 = await mock.events.index.manifest.get({ cache: true });
      const res2 = await mock.events.index.manifest.get({ cache: 'force' });

      const expectNoCachefile = (dir: t.FsBusManifestDirResponse) => {
        const files = asFiles(dir);
        const exists = files.some((file) => file.endsWith(DEFAULT.CACHE_FILENAME));
        expect(exists).to.eql(false);
      };

      expectNoCachefile(res1.dirs[0]);
      expectNoCachefile(res2.dirs[0]);

      mock.dispose();
    });

    it('save within multiple dirs', async () => {
      const { mock } = await cachePrep();
      await mock.events.index.manifest.get({
        dir: ['/', 'data/foo', '/data/bar', 'data/404'],
        cache: true,
      });

      const cacheFile = (path: string) => Path.join(path, DEFAULT.CACHE_FILENAME);
      const expectExists = async (path: string, expected: boolean) => {
        const exists = await mock.fileExists(path);
        expect(exists).to.eql(expected);
      };

      await expectExists('data/404', false); // NB: When a folder doesn't exist, it is not created by the cache.
      await expectExists(cacheFile('/'), true);
      await expectExists(cacheFile('data/foo'), true);
      await expectExists(cacheFile('data/bar'), true);

      mock.dispose();
    });

    it('custom "cachefile" name ("index.json")', async () => {
      const { mock, loadCachedFile } = await cachePrep();
      const cachefile = 'index.json';

      expect(await loadCachedFile(cachefile)).to.eql(undefined);

      const res1 = await mock.events.index.manifest.get({ cachefile }); // NB: cache flag not set, but assumed true because "cachefile" name provided.
      expect(await loadCachedFile(cachefile)).to.eql(res1.dirs[0].manifest);

      await mock.events.index.manifest.get({ cache: 'remove', cachefile }); // No save
      expect(await loadCachedFile(cachefile)).to.eql(undefined);

      await mock.events.index.manifest.get({ cache: false, cachefile }); // No save
      expect(await loadCachedFile(cachefile)).to.eql(undefined);

      const res2 = await mock.events.index.manifest.get({ cache: 'force', cachefile }); // Save
      expect(await loadCachedFile(cachefile)).to.eql(res2.dirs[0].manifest);

      await mock.events.index.manifest.get({ cache: 'remove', cachefile });
      expect(await loadCachedFile(cachefile)).to.eql(undefined);

      const res3 = await mock.events.index.manifest.get({ cache: true, cachefile }); // Save
      expect(await loadCachedFile(cachefile)).to.eql(res3.dirs[0].manifest);

      mock.dispose();
    });
  });
});
