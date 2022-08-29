import {
  describe,
  it,
  DEFAULT,
  ManifestFiles,
  expect,
  Hash,
  t,
  // TestFs,
  // TestPrep,
} from '../TEST/index.mjs';

// const nodefs = TestFs.node;

describe('BusController.Indexer', function () {
  // this.beforeEach(() => TestFs.reset());

  type R = t.SysFsManifestDirResponse;
  const asFiles = (dir: R) => ManifestFiles.sort(dir.manifest.files.map((file) => file.path));

  describe('manifest', () => {
    it.skip('empty', async () => {
      // const mock = await TestPrep();
      // const res = await mock.events.index.manifest.get();
      // await mock.dispose();
      // const item = res.dirs[0];
      // const manifest = item.manifest;
      // expect(res.dirs.length).to.eql(1);
      // expect(item.dir).to.eql(mock.dir);
      // expect(manifest.kind).to.eql('dir');
      // expect(typeof manifest.dir.indexedAt === 'number').to.eql(true);
      // expect(manifest.files).to.eql([]);
      // expect(manifest.hash.files).to.eql(Hash.sha256([]));
    });

    it.skip('root (no "dir" parameter passed)', async () => {
      // const mock = await TestPrep();
      // const io = mock.events.io;
      // const src1 = await TestFs.readFile('static.test/data/01.json');
      // const src2 = await TestFs.readFile('static.test/child/tree.png');
      // const path1 = '/foo/data.json';
      // const path2 = '/bar/tree.png';
      // await io.write.fire({ path: path1, hash: src1.hash, data: src1.data });
      // await io.write.fire({ path: path2, hash: src2.hash, data: src2.data });
      // const res = await mock.events.index.manifest.get();
      // await mock.dispose();
      // const item = res.dirs[0];
      // const manifest = item.manifest;
      // expect(res.dirs.length).to.eql(1);
      // expect(item.dir).to.eql(mock.dir);
      // expect(manifest.kind).to.eql('dir');
      // expect(typeof manifest.dir.indexedAt === 'number').to.eql(true);
      // const files = manifest.files;
      // expect(files.length).to.eql(2);
      // expect(files.map(({ path }) => path)).to.eql(['bar/tree.png', 'foo/data.json']);
      // expect(files[0].image?.kind).to.eql('png');
      // expect(files[1].image).to.eql(undefined);
    });

    it.skip('empty "dir" param variants (return root)', async () => {
      // const mock = await TestPrep();
      // const io = mock.events.io;
      // const src = await TestFs.readFile('static.test/data/01.json');
      // const write = (path: string) => io.write.fire({ path, hash: src.hash, data: src.data });
      // await write('/root.json');
      // await write('/data/foo/data.json');
      // await write('/data/foo/child/list.json');
      // const all = ['data/foo/child/list.json', 'data/foo/data.json', 'root.json'];
      // const test = async (dir: string | string[]) => {
      //   const res = await mock.events.index.manifest.get({ dir });
      //   expect(res.dirs.length).to.eql(1);
      //   expect(asFiles(res.dirs[0])).to.eql(all);
      // };
      // await test('');
      // await test('  ');
      // await test('/');
      // await test('  /  ');
      // await test([]);
      // await test(['']);
      // await test(['  ']);
      // await test(['/']);
      // await test([' / ']);
      // await test(['', '   ', '']);
      // await test(['/', '', '  /  ', ' ']);
      // await mock.dispose();
    });

    it.skip('multiple sub-trees', async () => {
      // const mock = await TestPrep();
      // const io = mock.events.io;
      // const src = await TestFs.readFile('static.test/data/01.json');
      // const write = (path: string) => io.write.fire({ path, hash: src.hash, data: src.data });
      // await write('/root.json');
      // await write('/data/foo/data.json');
      // await write('/data/foo/child/list.json');
      // await write('/logs/archive/main.log');
      // await write('/logs/main.log');
      // const all = [
      //   'data/foo/child/list.json',
      //   'data/foo/data.json',
      //   'logs/archive/main.log',
      //   'logs/main.log',
      //   'root.json',
      // ];
      // const dir = ['  ', '/', '    /data/foo  ', '  logs  ', '/404'];
      // const res = await mock.events.index.manifest.get({ dir });
      // await mock.dispose();
      // const files1 = asFiles(res.dirs[0]);
      // const files2 = asFiles(res.dirs[1]);
      // const files3 = asFiles(res.dirs[2]);
      // const files4 = asFiles(res.dirs[3]);
      // expect(files1).to.eql(all); // NB: The first two parameter entries collapse into a single index (the "root")
      // expect(files2).to.eql(['data/foo/child/list.json', 'data/foo/data.json']);
      // expect(files3).to.eql(['logs/archive/main.log', 'logs/main.log']);
      // expect(files4).to.eql([]);
    });

    it.skip('hash comparison (SHA256)', async () => {
      // const mock = await TestPrep();
      // const io = mock.events.io;
      // const src1 = await TestFs.readFile('static.test/data/01.json');
      // const src2 = await TestFs.readFile('static.test/child/tree.png');
      // const path1 = 'foo/data.json';
      // const path2 = 'bar/tree.png';
      // await io.write.fire({ path: path1, hash: src1.hash, data: src1.data });
      // await io.write.fire({ path: path2, hash: src2.hash, data: src2.data });
      // const res = await mock.events.index.manifest.get();
      // const manifest = res.dirs[0].manifest;
      // const find = (path: string) => manifest.files.find((file) => file.path === path);
      // const file1 = find(path1);
      // const file2 = find(path2);
      // expect(file1?.filehash).to.eql(src1.hash);
      // expect(file2?.filehash).to.eql(src2.hash);
      // await mock.dispose();
    });

    it.skip('error: binary not an image, but named with an image extension ', async () => {
      // const mock = await TestPrep();
      // const io = mock.events.io;
      // const src = await TestFs.readFile('static.test/data/01.json');
      // const write = (path: string) => io.write.fire({ path, hash: src.hash, data: src.data });
      // await write('json.png'); // NB: Writing the JSON file with an image file-extension.
      // const res = await mock.events.index.manifest.get({});
      // await mock.dispose();
      // expect(res.dirs.length).to.eql(1);
      // const manifest = res.dirs[0].manifest;
      // const files = manifest.files;
      // expect(files.length).to.eql(1);
      // expect(files[0].path).to.eql('json.png');
      // expect(files[0].image).to.eql(undefined); // NB: Not assigned as this is not really an image.
    });
  });

  describe('manifest caching', () => {
    const cachePrep = async () => {
      // const mock = await TestPrep();
      // const io = mock.events.io;
      // const src = await TestFs.readFile('static.test/data/01.json');
      // const write = (path: string) => io.write.fire({ path, hash: src.hash, data: src.data });
      // await write('/root.json');
      // await write('/data/bar/list.json');
      // await write('/data/foo/data.json');
      // const all = ['data/bar/list.json', 'data/foo/data.json', 'root.json'];
      // const cachefile = nodefs.join(mock.dir, DEFAULT.CACHE_FILENAME);
      // const loadCachedFile = async (filename?: string) => {
      //   const cachefile = nodefs.join(mock.dir, filename ?? DEFAULT.CACHE_FILENAME);
      //   if (!(await nodefs.exists(cachefile))) return undefined;
      //   return (await nodefs.readJson(cachefile)) as t.DirManifest;
      // };
      // return { mock, all, cachefile, loadCachedFile };
    };

    it.skip('no caching - default', async () => {
      // const { mock, all, cachefile } = await cachePrep();
      // const test = async (cache: boolean | undefined) => {
      //   const res = await mock.events.index.manifest.get({ cache });
      //   expect(await nodefs.exists(cachefile)).to.eql(false);
      //   const files = asFiles(res.dirs[0]);
      //   expect(files).to.eql(all);
      // };
      // await test(undefined);
      // await test(false);
      // await mock.dispose();
    });

    it.skip('cache:true (uses cache)', async () => {
      // const { mock, all, cachefile, loadCachedFile } = await cachePrep();
      // expect(await loadCachedFile()).to.eql(undefined);
      // const res1 = await mock.events.index.manifest.get({ cache: true });
      // expect(asFiles(res1.dirs[0])).to.eql(all);
      // expect(await nodefs.exists(cachefile)).to.eql(true);
      // expect(await loadCachedFile()).to.eql(res1.dirs[0].manifest);
      // // Manipulate the cached file to test if it's used.
      // const json = await loadCachedFile();
      // (json?.files[0] as any).foobar = 'my-test';
      // await nodefs.writeJson(cachefile, json);
      // // Requery and ensure the cached version is returned.
      // const res2 = await mock.events.index.manifest.get({ cache: true });
      // expect((res2.dirs[0].manifest.files[0] as any).foobar).to.eql('my-test');
      // await mock.dispose();
    });

    it.skip('cache: "force"', async () => {
      // const { mock, cachefile, loadCachedFile } = await cachePrep();
      // expect(await loadCachedFile()).to.eql(undefined);
      // const res1 = await mock.events.index.manifest.get({ cache: true });
      // expect((res1.dirs[0].manifest.files[0] as any).foobar).to.eql(undefined);
      // // Manipulate the cached file to test if it's used.
      // const json = await loadCachedFile();
      // (json?.files[0] as any).foobar = 'my-test';
      // await nodefs.writeJson(cachefile, json);
      // // Requery and ensure the cached version is returned.
      // const res2 = await mock.events.index.manifest.get({ cache: true });
      // expect((res2.dirs[0].manifest.files[0] as any).foobar).to.eql('my-test');
      // // Query again and "force".
      // const res3 = await mock.events.index.manifest.get({ cache: 'force' });
      // expect((res3.dirs[0].manifest.files[0] as any).foobar).to.eql(undefined);
      // expect(await loadCachedFile()).to.eql(res3.dirs[0].manifest);
      // await mock.dispose();
    });

    it.skip('cache: "remove"', async () => {
      // const { mock, loadCachedFile } = await cachePrep();
      // const manifest = mock.events.index.manifest;
      // expect(await loadCachedFile()).to.eql(undefined);
      // await manifest.get({ cache: true });
      // expect((await loadCachedFile())?.kind).to.eql('dir');
      // const res = await manifest.get({ cache: 'remove' });
      // const rootJson = res.dirs[0].manifest.files.find((item) => item.path === 'root.json');
      // expect(rootJson?.path).to.eql('root.json');
      // // NB: Ensure the "remove" flag caused the file to be cleared.
      // expect(await loadCachedFile()).to.eql(undefined);
      // // NB: Ensure repeat calls (when cache does not exist) do not fail.
      // await manifest.get({ cache: 'remove' });
      // await manifest.get({ cache: 'remove' });
      // await manifest.get({ cache: 'remove' });
      // await mock.dispose();
    });

    it.skip('cache: "remove" (custom filename)', async () => {
      // const { mock, loadCachedFile } = await cachePrep();
      // const manifest = mock.events.index.manifest;
      // const cachefile = 'index.json';
      // expect(await loadCachedFile(cachefile)).to.eql(undefined);
      // await manifest.get({ cache: true, cachefile });
      // expect((await loadCachedFile(cachefile))?.kind).to.eql('dir');
      // await manifest.get({ cache: 'remove', cachefile });
      // // NB: Ensure the "remove" flag caused the file to be cleared.
      // expect(await loadCachedFile(cachefile)).to.eql(undefined);
      // await mock.dispose();
    });

    it.skip('does not include cached ".dir" file within manifest', async () => {
      // const { mock, loadCachedFile } = await cachePrep();
      // expect(await loadCachedFile()).to.eql(undefined);
      // const res1 = await mock.events.index.manifest.get({ cache: true });
      // const res2 = await mock.events.index.manifest.get({ cache: 'force' });
      // const expectNoCachefile = (dir: t.SysFsManifestDirResponse) => {
      //   const files = asFiles(dir);
      //   const exists = files.some((file) => file.endsWith(DEFAULT.CACHE_FILENAME));
      //   expect(exists).to.eql(false);
      // };
      // expectNoCachefile(res1.dirs[0]);
      // expectNoCachefile(res2.dirs[0]);
      // await mock.dispose();
    });

    it.skip('save within multiple dirs', async () => {
      // const { mock } = await cachePrep();
      // await mock.events.index.manifest.get({
      //   dir: ['/', 'data/foo', '/data/bar', 'data/404'],
      //   cache: true,
      // });
      // const cacheFile = (path: string) => nodefs.join(path, DEFAULT.CACHE_FILENAME);
      // const expectExists = async (path: string, expected: boolean) => {
      //   path = nodefs.join(mock.dir, path);
      //   const exists = await nodefs.exists(path);
      //   expect(exists).to.eql(expected);
      // };
      // await expectExists('data/404', false); // NB: When a folder doesn't exist, it is not created by the cache.
      // await expectExists(cacheFile('/'), true);
      // await expectExists(cacheFile('data/foo'), true);
      // await expectExists(cacheFile('data/bar'), true);
      // await mock.dispose();
    });

    it.skip('custom "cachefile" name ("index.json")', async () => {
      // const { mock, loadCachedFile } = await cachePrep();
      // const cachefile = 'index.json';
      // expect(await loadCachedFile(cachefile)).to.eql(undefined);
      // const res1 = await mock.events.index.manifest.get({ cachefile }); // NB: cache flag not set, but assumed true because "cachefile" name provided.
      // expect(await loadCachedFile(cachefile)).to.eql(res1.dirs[0].manifest);
      // await mock.events.index.manifest.get({ cache: 'remove', cachefile }); // No save
      // expect(await loadCachedFile(cachefile)).to.eql(undefined);
      // await mock.events.index.manifest.get({ cache: false, cachefile }); // No save
      // expect(await loadCachedFile(cachefile)).to.eql(undefined);
      // const res2 = await mock.events.index.manifest.get({ cache: 'force', cachefile }); // Save
      // expect(await loadCachedFile(cachefile)).to.eql(res2.dirs[0].manifest);
      // await mock.events.index.manifest.get({ cache: 'remove', cachefile });
      // expect(await loadCachedFile(cachefile)).to.eql(undefined);
      // const res3 = await mock.events.index.manifest.get({ cache: true, cachefile }); // Save
      // expect(await loadCachedFile(cachefile)).to.eql(res3.dirs[0].manifest);
      // await mock.dispose();
    });
  });
});
