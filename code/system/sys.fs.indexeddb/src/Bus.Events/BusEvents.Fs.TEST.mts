// import { expect, expectError, TestFs, TestPrep, beforeEach } from '../TEST/index.mjs';
import { describe, it } from '../TEST/index.mjs';

// import { stringify, Path, t, Hash, ManifestFiles, DEFAULT } from './common.mjs';
import { t, rx, Path, Time, Hash, cuid, slug } from './common.mjs';
import { Mock } from '../TEST/index.mjs';

// const nodefs = TestFs.node;

async function TestPrep(options: { id?: string; dir?: string } = {}) {
  //
  const { dir } = options;

  const bus = rx.bus<t.SysFsEvent>();
  const id = options.id ?? 'foo';
  const driver = Mock.FsDriver({ dir });

  console.log('------------------------------------------');
  console.log('slug', slug());
  console.log('cuid', cuid());

  const api = {};

  return api;
}

describe('BusEvents.Fs', function () {
  // beforeEach(() => TestFs.reset());

  it('TMP', async () => {
    //
    // console.log('Mock', Mock);
    // const driver = Mock.FsDriver({});
    const mock = await TestPrep();

    console.log('-------------------------------------------');
    console.log('mock', mock);
    // console.log('driver', driver);

    const { randomFillSync } = await import('crypto');
    console.log('randomFillSync', randomFillSync);

    /**
     * TODO 🐷
     */
  });

  describe('sub-directory', () => {
    it.skip('normalise "root" sub-directory', async () => {
      // const mock = await TestPrep();
      // const file = await mock.copy('static.test/child/tree.png', 'images/tree.png');
      // const test = async (dir: string) => {
      //   const fs = mock.events.fs(dir);
      //   const info = await fs.info('images/tree.png');
      //   expect(info.hash).to.eql(file.hash);
      // };
      // await test('');
      // await test('  ');
      // await test('/');
      // await test('///');
      // await test(' / ');
      // await test(' // ');
      // await mock.dispose();
    });
  });

  describe('path', () => {
    it.skip('join', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const test = (input: string[], output: string) => {
      //   const res = fs.join(...input);
      //   expect(res).to.eql(output);
      // };
      // test(['foo', 'bar'], 'foo/bar');
      // test(['', ''], '/');
      // await mock.dispose();
    });
  });

  describe('dir (sub-filesystem)', () => {
    it.skip('deep', async () => {
      // const mock = await TestPrep();
      // await mock.reset();
      // await mock.copy('static.test/child/tree.png', 'foo/bar/tree.png');
      // const fs = mock.events.fs();
      // const dir1 = fs.dir('foo');
      // const dir2 = dir1.dir('bar');
      // // NB: messy root directory scrubbed out
      // const dir3 = fs.dir('');
      // const dir4 = fs.dir('/');
      // const dir5 = fs.dir(' /// ');
      // expect(await fs.exists('foo/bar/tree.png')).to.eql(true);
      // expect(await dir1.exists('tree.png')).to.eql(false);
      // expect(await dir2.exists('tree.png')).to.eql(true);
      // expect(await dir3.exists('foo/bar/tree.png')).to.eql(true);
      // expect(await dir4.exists('foo/bar/tree.png')).to.eql(true);
      // expect(await dir5.exists('foo/bar/tree.png')).to.eql(true);
      // await mock.dispose();
    });

    it.skip('path variants', async () => {
      // const mock = await TestPrep();
      // await mock.copy('static.test/child/tree.png', 'foo/bar/tree.png');
      // const fs = mock.events.fs();
      // const test = async (path: string, exists: boolean) => {
      //   const dir = fs.dir(path);
      //   expect(await dir.exists('tree.png')).to.eql(exists);
      // };
      // await test('foo/bar', true);
      // await test('  foo/bar  ', true);
      // await test('/foo/bar', true);
      // await test('foo/bar/', true);
      // await test('///foo/bar/', true);
      // await test('  //foo/bar// ', true);
      // await test('/', false);
      // await test('/tree.png', false);
      // await mock.dispose();
    });

    it.skip('sub-directory not specified', async () => {
      // const mock = await TestPrep();
      // await mock.copy('static.test/child/tree.png', 'foo/bar/tree.png');
      // const fs = mock.events.fs();
      // const test = async (path: string) => {
      //   const dir = fs.dir(path);
      //   expect(await dir.exists('foo/bar/tree.png')).to.eql(true);
      // };
      // await test('');
      // await test('  ');
      // await test('/');
      // await test(' / ');
      // await test(' /// ');
      // await mock.dispose();
    });
  });

  describe('info', () => {
    it.skip('file', async () => {
      // const mock = await TestPrep();
      // await mock.copy('static.test/child/tree.png', 'images/tree.png');
      // const fs = mock.events.fs();
      // const file = await mock.readFile(nodefs.join(mock.rootDir, 'images/tree.png'));
      // const info = await fs.info('///images/tree.png');
      // await mock.dispose();
      // expect(info.exists).to.eql(true);
      // expect(info.kind).to.eql('file');
      // expect(info.path).to.eql('images/tree.png');
      // expect(info.hash).to.eql(file.hash);
      // expect(info.bytes).to.eql(file.data.byteLength);
    });

    it.skip('file (does not exist)', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const info = await fs.info('///images/tree.png');
      // await mock.dispose();
      // expect(info.exists).to.eql(false);
      // expect(info.kind).to.eql('unknown');
      // expect(info.path).to.eql('images/tree.png');
      // expect(info.hash).to.eql('');
      // expect(info.bytes).to.eql(-1);
    });

    it.skip('dir', async () => {
      // const mock = await TestPrep();
      // await mock.copy('static.test/child/tree.png', 'images/foo/tree.png');
      // const fs = mock.events.fs();
      // const info = await fs.info('///images/foo/');
      // await mock.dispose();
      // expect(info.exists).to.eql(true);
      // expect(info.kind).to.eql('dir');
      // expect(info.path).to.eql('images/foo/');
      // expect(info.hash).to.eql('');
      // expect(info.bytes).to.eql(-1);
    });

    it.skip('within "sub/directory"', async () => {
      // const mock = await TestPrep();
      // await mock.copy('static.test/child/tree.png', 'images/tree.png');
      // const file = await mock.readFile(nodefs.join(mock.rootDir, 'images/tree.png'));
      // const fs1 = mock.events.fs();
      // const fs2 = mock.events.fs('  images  ');
      // const info1 = await fs1.info('///images/tree.png');
      // const info2 = await fs2.info('  tree.png  ');
      // expect(info1.exists).to.eql(true);
      // expect(info1.hash).to.eql(file.hash);
      // expect(info1.bytes).to.eql(file.data.byteLength);
      // expect(info2.exists).to.eql(info1.exists);
      // expect(info2.hash).to.eql(info1.hash);
      // expect(info2.bytes).to.eql(info1.bytes);
      // expect(info1.path).to.eql('images/tree.png');
      // expect(info2.path).to.eql('tree.png');
    });
  });

  describe('info: exists', () => {
    it.skip('file: true', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const src = await nodefs.readFile('static.test/data.json');
      // await fs.write('foo/bar.json', src);
      // const test = async (path: string) => {
      //   const res = await fs.exists(path);
      //   expect(res).to.eql(true);
      // };
      // await test('foo/bar.json');
      // await test('  /foo/bar.json  ');
      // await test('  ///foo/bar.json  ');
      // await mock.dispose();
    });

    it.skip('file: false', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const test = async (path: any) => {
      //   const res = await fs.exists(path);
      //   expect(res).to.eql(false);
      // };
      // await test('foo/bar.json');
      // await test('    ');
      // await test(null);
      // await test({});
      // await test([]);
      // await mock.dispose();
    });

    it.skip('dir', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const src = await nodefs.readFile('static.test/data.json');
      // await fs.write('foo/bar/data.json', src);
      // const test = async (path: any, exists: boolean) => {
      //   const res = await fs.exists(path);
      //   expect(res).to.eql(exists, path);
      // };
      // await test('foo', true);
      // await test('/foo', true);
      // await test('  foo/bar//  ', true);
      // await test('foo/bar  ', true);
      // await test('/', true);
      // await test('   ', true); // NB: root dir.
      // await test('zoo', false);
      // await test(null, false);
      // await test({}, false);
      // await test([], false);
      // await mock.dispose();
    });

    it.skip('within "sub/directory"', async () => {
      // const mock = await TestPrep();
      // await mock.copy('static.test/child/tree.png', 'images/tree.png');
      // const root = mock.events.fs();
      // const subdir = mock.events.fs('images');
      // expect(await root.exists('images/tree.png')).to.eql(true);
      // expect(await root.exists('tree.png')).to.eql(false);
      // expect(await subdir.exists('tree.png')).to.eql(true);
      // expect(await subdir.exists('///tree.png')).to.eql(true);
      // expect(await subdir.exists('foo.png')).to.eql(false);
      // await mock.dispose();
    });
  });

  describe('info: is (flags)', () => {
    it.skip('is.file', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // await mock.copy('static.test/child/tree.png', 'images/tree.png');
      // const test = async (path: string, expected: boolean) => {
      //   const res = await fs.is.file(path);
      //   expect(res).to.eql(expected);
      // };
      // await test('images/tree.png', true);
      // await test('  //images/tree.png  ', true);
      // await test('images', false);
      // await test('', false);
      // await mock.dispose();
    });

    it.skip('is.dir', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // await mock.copy('static.test/child/tree.png', 'images/tree.png');
      // const test = async (path: string, expected: boolean) => {
      //   const res = await fs.is.dir(path);
      //   expect(res).to.eql(expected);
      // };
      // await test('images', true);
      // await test(' //images/  ', true);
      // await test('/', true);
      // await test('   ', true); // NB: root directory
      // await test('images/tree.png', false);
      // await test('  //images/tree.png  ', false);
      // await mock.dispose();
    });
  });

  describe('info: {manifest}', () => {
    it.skip('read: no files (empty directory)', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const manifest = await fs.manifest();
      // expect(manifest.files).to.eql([]); // NB: empty folder.
      // await mock.dispose();
    });

    it.skip('read: files', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const src = await mock.readFile('static.test/child/tree.png');
      // await fs.write('images/tree.png', src.data);
      // await fs.write('images/foo/tree.png', src.data);
      // const manifest = await fs.manifest();
      // const find = (path: string) => manifest.files.find((file) => file.path === path);
      // const file1 = find('images/tree.png');
      // const file2 = find('images/foo/tree.png');
      // expect(manifest.files.length).to.eql(2);
      // expect(file1?.path).to.eql('images/tree.png');
      // expect(file2?.path).to.eql('images/foo/tree.png');
      // expect(file1?.filehash).to.eql(src.hash);
      // expect(file2?.filehash).to.eql(src.hash);
      // await mock.dispose();
    });

    it.skip('read: fs.dir("child").manifest', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const src = await mock.readFile('static.test/child/tree.png');
      // await fs.write('root.png', src.data);
      // await fs.write('images/tree.png', src.data);
      // await fs.write('images/foo/tree.png', src.data);
      // const dir1 = fs.dir('images');
      // const dir2 = dir1.dir('  //foo// ');
      // const manifest1 = await fs.manifest();
      // const manifest2 = await dir1.manifest();
      // const manifest3 = await dir2.manifest();
      // const paths = (manifest: t.DirManifest) =>
      //   ManifestFiles.sort(manifest.files).map((file) => file.path);
      // expect(paths(manifest1)).to.eql(['images/foo/tree.png', 'images/tree.png', 'root.png']);
      // expect(paths(manifest2)).to.eql(['foo/tree.png', 'tree.png']);
      // expect(paths(manifest3)).to.eql(['tree.png']);
      // await mock.dispose();
    });

    it.skip('sub-directory (parameter)', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const src = await mock.readFile('static.test/child/tree.png');
      // await fs.write('root.png', src.data);
      // await fs.write('images/tree.png', src.data);
      // await fs.write('images/foo/tree.png', src.data);
      // const manifest1 = await fs.manifest();
      // const manifest2 = await fs.manifest({ dir: '  //images// ' });
      // const manifest3 = await fs.dir('  //images//  ').manifest({ dir: ' //foo// ' });
      // const manifest4 = await fs.dir('  //images//  ').manifest({ dir: ' //404// ' });
      // const manifest5 = await fs.dir('  //404//  ').manifest();
      // const paths = (manifest: t.DirManifest) =>
      //   ManifestFiles.sort(manifest.files).map((file) => file.path);
      // expect(paths(manifest1)).to.eql(['images/foo/tree.png', 'images/tree.png', 'root.png']);
      // expect(paths(manifest2)).to.eql(['images/foo/tree.png', 'images/tree.png']);
      // expect(paths(manifest3)).to.eql(['foo/tree.png']);
      // expect(paths(manifest4)).to.eql([]);
      // expect(paths(manifest5)).to.eql([]);
      // await mock.dispose();
    });

    it.skip('filter', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const src = await mock.readFile('static.test/child/tree.png');
      // await fs.write('images/tree.png', src.data);
      // await fs.write('images/foo/willow.png', src.data);
      // const manifest1 = await fs.manifest({ filter: (e) => e.path.endsWith('.txt') });
      // const manifest2 = await fs.manifest({ filter: (e) => e.path.endsWith('/foo/willow.png') });
      // expect(manifest1.files.length).to.eql(0);
      // expect(manifest2.files.length).to.eql(1);
      // expect(manifest2.files[0].path).to.eql('images/foo/willow.png');
      // await mock.dispose();
    });

    describe('cache', () => {
      it.skip('cache: true', async () => {
        // const mock = await TestPrep();
        // const fs = mock.events.fs();
        // const src = await mock.readFile('static.test/child/tree.png');
        // await fs.write('images/tree.png', src.data);
        // const expectCacheExists = async (exists: boolean) => {
        //   const manifest = await fs.json.read(DEFAULT.CACHE_FILENAME);
        //   expect(Boolean(manifest)).to.eql(exists);
        // };
        // await fs.manifest();
        // await expectCacheExists(false); // NB: no caching by default.
        // await fs.manifest({ cache: false });
        // await expectCacheExists(false);
        // await fs.manifest({ cache: true });
        // await expectCacheExists(true);
        // await mock.dispose();
      });

      it.skip('cache: "remove"', async () => {
        // const mock = await TestPrep();
        // const fs = mock.events.fs();
        // const src = await mock.readFile('static.test/child/tree.png');
        // await fs.write('images/tree.png', src.data);
        // const expectCacheExists = async (exists: boolean) => {
        //   const manifest = await fs.json.read(DEFAULT.CACHE_FILENAME);
        //   expect(Boolean(manifest)).to.eql(exists);
        // };
        // await fs.manifest({ cache: true });
        // await expectCacheExists(true);
        // await fs.manifest({ cache: 'remove' });
        // await expectCacheExists(false);
        // await mock.dispose();
      });

      it.skip('cache: "force"', async () => {
        // const mock = await TestPrep();
        // const fs = mock.events.fs();
        // const src = await mock.readFile('static.test/child/tree.png');
        // await fs.write('tree.png', src.data);
        // const paths = (manifest?: t.DirManifest) =>
        //   ManifestFiles.sort((manifest?.files || []).map((file) => file.path));
        // const readManifest = () => fs.json.read<t.DirManifest>(DEFAULT.CACHE_FILENAME);
        // const readManifestPaths = async () => paths(await readManifest());
        // const expectManifestPaths = async (paths: string[]) =>
        //   expect(await readManifestPaths()).to.eql(ManifestFiles.sort(paths));
        // await expectManifestPaths([]);
        // await fs.manifest({ cache: true });
        // await expectManifestPaths(['tree.png']);
        // await fs.write('images/foo.png', src.data);
        // // No change (filesystem changed BUT cached).
        // await expectManifestPaths(['tree.png']);
        // await fs.manifest();
        // await expectManifestPaths(['tree.png']);
        // await fs.manifest({ cache: false });
        // await expectManifestPaths(['tree.png']);
        // await fs.manifest({ cache: true });
        // await expectManifestPaths(['tree.png']);
        // // Force update.
        // await fs.manifest({ cache: 'force' });
        // await expectManifestPaths(['tree.png', 'images/foo.png']);
        // await fs.manifest();
        // await fs.manifest({ cache: true });
        // await expectManifestPaths(['tree.png', 'images/foo.png']);
        // await mock.dispose();
      });

      it.skip('cache: custom filename', async () => {
        // const mock = await TestPrep();
        // const fs = mock.events.fs();
        // const src = await mock.readFile('static.test/child/tree.png');
        // await fs.write('tree.png', src.data);
        // const cachefile = 'index.json';
        // const paths = (manifest?: t.DirManifest) =>
        //   (manifest?.files || []).map((file) => file.path);
        // const readManifest = () => fs.json.read<t.DirManifest>(cachefile);
        // const readManifestPaths = async () => paths(await readManifest());
        // const expectManifestPaths = async (paths: string[]) =>
        //   expect(await readManifestPaths()).to.eql(paths);
        // expect(await readManifest()).to.eql(undefined);
        // fs.manifest({ cachefile });
        // expect(await readManifest()).to.eql(undefined);
        // const res = await fs.manifest({ cachefile });
        // await expectManifestPaths(['tree.png']);
        // expect(paths(res)).to.eql(['tree.png']);
        // await fs.manifest({ cachefile, cache: 'remove' });
        // expect(await readManifest()).to.eql(undefined);
        // await mock.dispose();
      });
    });
  });

  describe('read', () => {
    it.skip('<undefined> (does not exist)', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const res = await fs.read('404.png');
      // await mock.dispose();
      // expect(res).to.eql(undefined);
    });

    it.skip('binary: Uint8Array', async () => {
      // const mock = await TestPrep();
      // const file = await mock.copy('static.test/child/tree.png', 'images/tree.png');
      // const fs = mock.events.fs();
      // const test = async (path: string) => {
      //   const res = await fs.read(path);
      //   expect(Hash.sha256(res)).to.eql(file.hash);
      // };
      // await test('/images/tree.png');
      // await test('///images/tree.png');
      // await test('  images/tree.png  ');
      // await mock.dispose();
    });

    it.skip('read within "/sub-directory"', async () => {
      // const mock = await TestPrep();
      // const file = await mock.copy('static.test/child/tree.png', 'images/tree.png');
      // const test = async (subdir: string, path: string) => {
      //   const fs = mock.events.fs({ dir: subdir });
      //   const res = await fs.read(path);
      //   expect(Hash.sha256(res)).to.eql(file.hash);
      // };
      // await test('images', '/tree.png');
      // await test('  /images  ', '  tree.png  ');
      // await mock.dispose();
    });
  });

  describe('write', () => {
    it.skip('write: binary file', async () => {
      // const mock = await TestPrep();
      // const src = await mock.readFile('static.test/child/tree.png');
      // const fs = mock.events.fs();
      // const test = async (path: string) => {
      //   await mock.reset();
      //   const targetPath = nodefs.join(mock.rootDir, Path.trim(path));
      //   const exists = async () => await nodefs.exists(targetPath);
      //   expect(await exists()).to.eql(false); // Not yet copied.
      //   // Write.
      //   const res = await fs.write(path, src.data);
      //   expect(await exists()).to.eql(true); // Exists now.
      //   const file = (await mock.readFile(targetPath)).data;
      //   const hash = Hash.sha256(file);
      //   expect(hash).to.eql(src.hash);
      //   expect(res.hash).to.eql(hash);
      //   expect(res.bytes).to.eql(file.byteLength);
      // };
      // await test('images/tree.png');
      // await test('  images/tree.png  ');
      // await test('    /images/tree.png   ');
      // await mock.dispose();
    });

    describe('simple types', () => {
      // const test = async (data: t.Json, expected: string) => {
      //   const mock = await TestPrep();
      //   await mock.reset();

      //   const path = 'my-file';
      //   const targetPath = nodefs.join(mock.rootDir, path);
      //   const fs = mock.events.fs();

      //   expect(await nodefs.exists(targetPath)).to.eql(false);
      //   const res = await fs.write(path, data);
      //   expect(await nodefs.exists(targetPath)).to.eql(true);

      //   await mock.dispose();

      //   const file = await mock.readFile(targetPath);
      //   const hash = Hash.sha256(file.data);
      //   expect(file.hash).to.eql(hash);
      //   expect(res.hash).to.eql(hash);
      //   expect(new TextDecoder().decode(file.data)).to.eql(expected);
      // };

      it.skip('write: string', async () => {
        // await test('hello', 'hello');
      });

      it.skip('write: number', async () => {
        // await test(1234, '1234');
      });

      it.skip('write: boolean', async () => {
        // await test(true, 'true');
        // await test(false, 'false');
      });

      it.skip('write: null', async () => {
        // await test(null, 'null');
      });

      it.skip('write: undefined', async () => {
        // await test(undefined, 'undefined');
      });

      it.skip('write: JSON [array]', async () => {
        // const json = [1, 2, 3];
        // await test(json, stringify(json));
      });

      it.skip('write: JSON {object}', async () => {
        // const json = { msg: 'hello', count: 123 };
        // await test(json, stringify(json));
      });
    });

    it.skip('write: within "/sub-directory"', async () => {
      // const mock = await TestPrep();
      // const data = await nodefs.readFile('static.test/child/tree.png');
      // const root = mock.events.fs();
      // const subdir = mock.events.fs('images');
      // expect(await root.exists('images/foo.png')).to.eql(false);
      // await subdir.write('foo.png', data);
      // expect(await root.exists('images/foo.png')).to.eql(true);
      // await mock.dispose();
    });

    it.skip('write: from node-js file buffer', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const data = await nodefs.readFile('static.test/data.json');
      // const path = 'foo/bar.json';
      // await fs.write(path, data);
      // const target = await nodefs.readJson(nodefs.join(mock.rootDir, path));
      // expect(target).to.eql(JSON.parse(data.toString()));
      // await mock.dispose();
    });

    describe('errors', () => {
      it.skip('throw: timeout', async () => {
        // const mock = await TestPrep();
        // const fs = mock.events.fs({ timeout: 10 });
        // const data = await nodefs.readFile('static.test/data.json');
        // mock.controller.dispose(); // NB: Kill the controller so the operation times out.
        // const fn = () => fs.write('foo.json', data);
        // await expectError(fn, 'Timed out after 10 msecs');
        // await mock.dispose();
      });

      it.skip('throw: attempt "step up" outside the root directory', async () => {
        // const mock = await TestPrep();
        // const src = await mock.readFile('static.test/data.json');
        // const fs = mock.events.fs();
        // // Success.
        // const res = await fs.write('data.json', src.data);
        // expect(res.hash).to.eql(src.hash);
        // // Fail (illegal path).
        // const fn = () => fs.write('../../data.json', src.data);
        // await expectError(fn, 'Failed while writing');
        // await mock.dispose();
      });
    });
  });

  describe('copy', () => {
    it.skip('copy: binary', async () => {
      // const mock = await TestPrep();
      // const src = await mock.readFile('static.test/child/tree.png');
      // const fs = mock.events.fs();
      // const path = {
      //   source: 'images/tree.png',
      //   target: 'images/foo.png',
      // };
      // await fs.write(path.source, src.data);
      // expect(await fs.exists(path.target)).to.eql(false); // Not yet copied.
      // await fs.copy(path.source, path.target);
      // expect(await fs.exists(path.target)).to.eql(true);
      // await mock.dispose();
    });

    it.skip('copy: "sub/directory"', async () => {
      // const mock = await TestPrep();
      // const src = await mock.readFile('static.test/child/tree.png');
      // const fs = mock.events.fs('images');
      // const path = {
      //   source: 'tree.png',
      //   target: 'foo/bar.png',
      // };
      // await fs.write(path.source, src.data);
      // await fs.copy(path.source, path.target);
      // expect(await fs.exists(path.target)).to.eql(true);
      // expect(await nodefs.exists(nodefs.join(mock.rootDir, 'images/foo/bar.png'))).to.eql(true);
      // await mock.dispose();
    });
  });

  describe('move', () => {
    it.skip('move: binary', async () => {
      // const mock = await TestPrep();
      // const src = await mock.readFile('static.test/child/tree.png');
      // const fs = mock.events.fs();
      // const path = {
      //   source: 'images/tree.png',
      //   target: 'images/foo.png',
      // };
      // await fs.write(path.source, src.data);
      // expect(await fs.exists(path.source)).to.eql(true);
      // expect(await fs.exists(path.target)).to.eql(false);
      // await fs.move(path.source, path.target);
      // expect(await fs.exists(path.source)).to.eql(false);
      // expect(await fs.exists(path.target)).to.eql(true);
      // await mock.dispose();
    });

    it.skip('move: "sub/directory"', async () => {
      // const mock = await TestPrep();
      // const src = await mock.readFile('static.test/child/tree.png');
      // const fs = mock.events.fs('images');
      // const path = {
      //   source: 'tree.png',
      //   target: 'foo/bar.png',
      // };
      // await fs.write(path.source, src.data);
      // await fs.move(path.source, path.target);
      // expect(await nodefs.exists(nodefs.join(mock.rootDir, 'images/tree.png'))).to.eql(false);
      // expect(await nodefs.exists(nodefs.join(mock.rootDir, 'images/foo/bar.png'))).to.eql(true);
      // await mock.dispose();
    });
  });

  describe('delete', () => {
    it.skip('delete: binary', async () => {
      // const mock = await TestPrep();
      // const src = await mock.readFile('static.test/child/tree.png');
      // const fs = mock.events.fs();
      // const path = 'images/tree.png';
      // await fs.write(path, src.data);
      // expect(await fs.exists(path)).to.eql(true);
      // await fs.delete(path);
      // expect(await fs.exists(path)).to.eql(false);
      // await mock.dispose();
    });

    it.skip('delete: "sub/directory"', async () => {
      // const mock = await TestPrep();
      // const src = await mock.readFile('static.test/child/tree.png');
      // const fs1 = mock.events.fs();
      // const fs2 = mock.events.fs('images');
      // const path1 = 'images/tree.png';
      // const path2 = 'tree.png';
      // await fs1.write(path1, src.data);
      // expect(await fs1.exists(path1)).to.eql(true);
      // expect(await fs2.exists(path2)).to.eql(true);
      // await fs2.delete(path2);
      // expect(await fs1.exists(path1)).to.eql(false);
      // expect(await fs2.exists(path2)).to.eql(false);
      // await mock.dispose();
    });
  });

  describe('json', () => {
    const test = async (data: t.Json) => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const path = 'foo/data.json';
      // const write = await fs.json.write(path, data);
      // const file = await mock.readFile(nodefs.join(mock.dir, path));
      // const read = await fs.json.read(path);
      // await mock.dispose();
      // expect(write.hash).to.eql(file.hash);
      // expect(read).to.eql(data);
    };

    it.skip('read: not found (undefined)', async () => {
      // const mock = await TestPrep();
      // const fs = mock.events.fs();
      // const res = await fs.json.read('404.json');
      // expect(res).to.eql(undefined);
      // await mock.dispose();
    });

    describe('write => read', () => {
      it.skip('{object}', async () => {
        // await test({});
        // await test({ msg: 'hello' });
      });

      it.skip('[array]', async () => {
        // await test([]);
        // await test([1, 2, 3]);
        // await test([1, { msg: 'hello' }, true]);
      });

      it.skip('boolean', async () => {
        // await test(true);
        // await test(false);
      });

      it.skip('number', async () => {
        // await test(0);
        // await test(1234);
        // await test(-999);
      });

      it.skip('string', async () => {
        // await test('   Hello   ');
        // await test('');
      });

      it.skip('null', async () => {
        // await test(null);
      });
    });

    describe('errors', () => {
      it.skip('throw: write undefined', async () => {
        // const fn = () => test(undefined);
        // expectError(fn, 'JSON cannot be undefined');
      });
    });
  });
});
