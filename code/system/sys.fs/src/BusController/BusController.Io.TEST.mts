import {
  describe,
  it,
  expect,
  rx,
  t,

  // TestFs, TestPrep, Filesystem
} from '../TEST/index.mjs';

describe('BusController.IO', function () {
  describe('info', function () {
    it.skip('defaults (no files)', async () => {
      // await TestFs.reset();
      // const bus = rx.bus<t.SysFsEvent>();
      // const id = 'foo';
      // const driver = TestFs.driver;
      // const index = TestFs.index(driver.dir);
      // const controller = Filesystem.Controller({ id, driver, index, bus });
      // const events = Filesystem.Events({ id, bus });
      // const res = await events.io.info.get();
      // controller.dispose();
      // expect(res.id).to.eql(id);
      // expect(res.fs?.id).to.eql(id);
      // expect(res.fs?.dir).to.eql(TestFs.driver.dir);
      // expect(res.paths).to.eql([]);
      // expect(res.error).to.eql(undefined);
    });

    it.skip('not found', async () => {
      // const mock = await TestPrep();
      // const info = await mock.events.io.info.get({ path: '/foo/bar.js', timeout: 10 });
      // await mock.dispose();
      // expect(info.paths.length).to.eql(1);
      // const file = info.paths[0];
      // expect(file.exists).to.eql(false);
      // expect(file.hash).to.eql('');
      // expect(file.bytes).to.eql(-1);
    });

    it.skip('file: single', async () => {
      // const mock = await TestPrep();
      // const src = await TestFs.readFile('static.test/child/kitten.jpg');
      // const path = '  foo/bar/kitty.jpg   '; // NB: spacing trimmed.
      // await mock.events.io.write.fire({ path, hash: src.hash, data: src.data });
      // const info = await mock.events.io.info.get({ path, timeout: 10 });
      // await mock.dispose();
      // expect(info.paths.length).to.eql(1);
      // const file = info.paths[0];
      // expect(file.kind).to.eql('file');
      // expect(file.path).to.eql('/foo/bar/kitty.jpg'); // NB: starts at absolute "/"
      // expect(file.hash).to.eql(src.hash);
      // expect(file.bytes).to.eql(src.data.byteLength);
    });

    it.skip('dir: single', async () => {
      // const mock = await TestPrep();
      // const src = await TestFs.readFile('static.test/child/kitten.jpg');
      // const path = '  foo/bar/kitty.jpg   '; // NB: spacing trimmed.
      // await mock.events.io.write.fire({ path, hash: src.hash, data: src.data });
      // const info = await mock.events.io.info.get({ path: '  foo/bar  ' });
      // await mock.dispose();
      // const dir = info.paths[0];
      // expect(dir.kind).to.eql('dir');
      // expect(dir.path).to.eql('/foo/bar/'); // NB: Ends with "/"
      // expect(dir.hash).to.eql('');
      // expect(dir.bytes).to.eql(-1);
    });

    it.skip('multiple paths', async () => {
      // const mock = await TestPrep();
      // await mock.reset();
      // const file = await TestFs.readFile('static.test/child/kitten.jpg');
      // const path1 = '/foo/bar/kitty.jpg';
      // const path2 = '/foo/bar/';
      // await mock.events.io.write.fire({ path: path1, hash: file.hash, data: file.data });
      // const info = await mock.events.io.info.get({ path: [path1, path2], timeout: 10 });
      // await mock.dispose();
      // expect(info.paths.length).to.eql(2);
      // expect(info.paths[0].kind).to.eql('file');
      // expect(info.paths[0].path).to.eql(path1);
      // expect(info.paths[0].hash).to.eql(file.hash);
      // expect(info.paths[0].bytes).to.eql(file.data.byteLength);
      // expect(info.paths[1].kind).to.eql('dir');
      // expect(info.paths[1].path).to.eql(path2);
      // expect(info.paths[1].hash).to.eql('');
      // expect(info.paths[1].bytes).to.eql(-1);
    });

    it.skip('error: timeout', async () => {
      // const bus = rx.bus<t.SysFsEvent>();
      // const driver = TestFs.driver;
      // const index = TestFs.index(driver.dir);
      // const controller = Filesystem.Controller({ id: 'foo', driver, index, bus });
      // const events = Filesystem.Events({ id: 'bar', bus });
      // const res = await events.io.info.get({ timeout: 10 });
      // controller.dispose();
      // expect(res.error?.code).to.eql('client/timeout');
      // expect(res.error?.message).to.include('Timed out');
    });
  });

  describe('read', function () {
    // this.beforeEach(() => TestFs.reset());

    it.skip('reads file (single)', async () => {
      // const mock = await TestPrep();
      // await mock.fs.copy(
      //   mock.fs.resolve('static.test/child/tree.png'),
      //   mock.fs.join(mock.dir, 'images/tree.png'),
      // );
      // const res = await mock.events.io.read.get('/images/tree.png');
      // await mock.dispose();
      // expect(res.error).to.eql(undefined);
      // expect(res.files.length).to.eql(1);
      // const files = res.files.map(({ file }) => file);
      // const original = await TestFs.readFile(mock.fs.join(mock.dir, 'images/tree.png'));
      // expect(files[0]?.hash).to.eql(original.hash);
      // expect(original.data.toString()).to.eql(files[0]?.data.toString());
    });

    it.skip('reads files (multiple)', async () => {
      // const mock = await TestPrep();
      // await mock.fs.copy(
      //   mock.fs.resolve('static.test/child/tree.png'),
      //   mock.fs.join(mock.dir, 'images/tree.png'),
      // );
      // await mock.fs.copy(
      //   mock.fs.resolve('static.test/child/kitten.jpg'),
      //   mock.fs.join(mock.dir, 'images/kitten.jpg'),
      // );
      // const res = await mock.events.io.read.get(['/images/tree.png', 'images/kitten.jpg']);
      // await mock.dispose();
      // expect(res.error).to.eql(undefined);
      // expect(res.files.length).to.eql(2);
      // const files = res.files.map(({ file }) => file);
      // const original1 = await TestFs.readFile(mock.fs.join(mock.dir, 'images/tree.png'));
      // const original2 = await TestFs.readFile(mock.fs.join(mock.dir, 'images/kitten.jpg'));
      // expect(files[0]?.hash).to.eql(original1.hash);
      // expect(files[1]?.hash).to.eql(original2.hash);
      // expect(original1.data.toString()).to.eql(files[0]?.data.toString());
      // expect(original2.data.toString()).to.eql(files[1]?.data.toString());
    });

    it.skip('error: "read/404"', async () => {
      // const mock = await TestPrep();
      // const res = await mock.events.io.read.get('path:/images/tree.png');
      // const file = res.files[0];
      // await mock.dispose();
      // expect(res.error?.code).to.eql('read');
      // expect(res.error?.message).to.include('Failed while reading');
      // expect(file.error?.code).to.eql('read/404');
      // expect(file.error?.message).to.include('File not found');
      // expect(file.error?.path).to.eql('/images/tree.png');
    });
  });

  describe('write', function () {
    // this.beforeEach(() => TestFs.reset());

    it.skip('writes file (single)', async () => {
      // const mock = await TestPrep();
      // const src = await TestFs.readFile('static.test/child/kitten.jpg');
      // const { hash, data } = src;
      // const path = 'foo/bar/kitten.jpg';
      // expect(await mock.fileExists(path)).to.eql(false);
      // const res = await mock.events.io.write.fire({ path: 'foo/bar/kitten.jpg', hash, data });
      // await mock.dispose();
      // expect(res.error).to.eql(undefined);
      // expect(res.files.length).to.eql(1);
      // expect(res.files[0].path).to.eql('/foo/bar/kitten.jpg'); // Absolute path ("/..") starting at [fs.dir] root.
      // expect(res.files[0].hash).to.eql(src.hash);
      // expect(await mock.fileExists(path)).to.eql(true);
      // const after = await TestFs.readFile(TestFs.join(mock.dir, 'foo/bar/kitten.jpg'));
      // expect(after.hash).to.eql(hash);
      // expect(after.data.toString()).to.eql(data.toString());
    });

    it.skip('write files (multiple)', async () => {
      // const mock = await TestPrep();
      // const src1 = await TestFs.readFile('static.test/child/kitten.jpg');
      // const src2 = await TestFs.readFile('static.test/child/tree.png');
      // const path = {
      //   kitten: 'foo/bar/kitten.jpg',
      //   tree: 'foo/bar/tree.png',
      // };
      // expect(await mock.fileExists(path.kitten)).to.eql(false);
      // expect(await mock.fileExists(path.tree)).to.eql(false);
      // const res = await mock.events.io.write.fire([
      //   { path: 'foo/bar/kitten.jpg', hash: src1.hash, data: src1.data },
      //   { path: 'foo/bar/tree.png', hash: src2.hash, data: src2.data },
      // ]);
      // await mock.dispose();
      // expect(res.error).to.eql(undefined);
      // expect(res.files.length).to.eql(2);
      // expect(res.files[0].path).to.eql('/foo/bar/kitten.jpg');
      // expect(res.files[1].path).to.eql('/foo/bar/tree.png');
      // expect(res.files[0].hash).to.eql(src1.hash);
      // expect(res.files[1].hash).to.eql(src2.hash);
      // expect(await mock.fileExists(path.kitten)).to.eql(true);
      // expect(await mock.fileExists(path.tree)).to.eql(true);
      // const after1 = await TestFs.readFile(TestFs.join(mock.dir, 'foo/bar/kitten.jpg'));
      // const after2 = await TestFs.readFile(TestFs.join(mock.dir, 'foo/bar/tree.png'));
      // expect(after1.hash).to.eql(src1.hash);
      // expect(after1.data.toString()).to.eql(src1.data.toString());
      // expect(after2.hash).to.eql(src2.hash);
      // expect(after2.data.toString()).to.eql(src2.data.toString());
    });
  });

  describe('delete', function () {
    // this.beforeEach(() => TestFs.reset());

    it.skip('delete (does not exist)', async () => {
      // const mock = await TestPrep();
      // const res = await mock.events.io.delete.fire('foo/404.txt');
      // await mock.dispose();
      // expect(res.files.length).to.eql(1);
      // expect(res.files[0].path).to.eql('/foo/404.txt');
      // expect(res.files[0].error).to.eql(undefined);
    });

    it.skip('delete (single)', async () => {
      // const mock = await TestPrep();
      // const src = await TestFs.readFile('static.test/child/kitten.jpg');
      // const { hash, data } = src;
      // const path = 'foo/bar/kitten.jpg';
      // await mock.events.io.write.fire({ path, hash, data });
      // expect(await mock.fileExists(path)).to.eql(true);
      // const res = await mock.events.io.delete.fire(path);
      // await mock.dispose();
      // expect(await mock.fileExists(path)).to.eql(false);
      // expect(res.files.length).to.eql(1);
      // expect(res.files[0].path).to.eql('/foo/bar/kitten.jpg');
      // expect(res.files[0].error).to.eql(undefined);
    });

    it.skip('delete (multiple)', async () => {
      // const mock = await TestPrep();
      // const src1 = await TestFs.readFile('static.test/child/kitten.jpg');
      // const src2 = await TestFs.readFile('static.test/child/tree.png');
      // const path1 = 'foo/bar/milk.jpg';
      // const path2 = 'foo/bar/green.png';
      // await mock.events.io.write.fire([
      //   { path: path1, hash: src1.hash, data: src1.data },
      //   { path: path2, hash: src2.hash, data: src2.data },
      // ]);
      // expect(await mock.fileExists(path1)).to.eql(true);
      // expect(await mock.fileExists(path2)).to.eql(true);
      // const res = await mock.events.io.delete.fire([path1, path2]);
      // await mock.dispose();
      // expect(await mock.fileExists(path1)).to.eql(false);
      // expect(await mock.fileExists(path2)).to.eql(false);
      // expect(res.files.length).to.eql(2);
      // expect(res.files[0].path).to.eql('/foo/bar/milk.jpg');
      // expect(res.files[0].error).to.eql(undefined);
      // expect(res.files[1].path).to.eql('/foo/bar/green.png');
      // expect(res.files[1].error).to.eql(undefined);
    });
  });

  describe('copy', function () {
    // this.beforeEach(() => TestFs.reset());

    it.skip('copy (single)', async () => {
      // const mock = await TestPrep();
      // const src = await TestFs.readFile('static.test/child/kitten.jpg');
      // const { hash, data } = src;
      // const path = {
      //   source: 'foo/bar/kitten.jpg',
      //   target: 'cat.jpg',
      // };
      // await mock.events.io.write.fire({ path: path.source, hash, data });
      // expect(await mock.fileExists(path.source)).to.eql(true);
      // const res = await mock.events.io.copy.fire({ source: path.source, target: path.target });
      // await mock.dispose();
      // expect(res.error).to.eql(undefined);
      // expect(res.files.length).to.eql(1);
      // expect(res.files[0].source).to.eql('/foo/bar/kitten.jpg');
      // expect(res.files[0].target).to.eql('/cat.jpg');
      // expect(await mock.fileExists(path.source)).to.eql(true);
      // expect(await mock.fileExists(path.target)).to.eql(true);
    });

    it.skip('copy (multiple)', async () => {
      // const mock = await TestPrep();
      // const src = await TestFs.readFile('static.test/child/kitten.jpg');
      // const { hash, data } = src;
      // const path1 = {
      //   source: 'foo/bar/kitten.jpg',
      //   target: 'cat.jpg',
      // };
      // const path2 = {
      //   source: 'foo/bar/kitten.jpg',
      //   target: 'animals/feline.jpg',
      // };
      // await mock.events.io.write.fire({ path: path1.source, hash, data });
      // expect(await mock.fileExists(path1.source)).to.eql(true);
      // const res = await mock.events.io.copy.fire([
      //   { source: path1.source, target: path1.target },
      //   { source: path2.source, target: path2.target },
      // ]);
      // await mock.dispose();
      // expect(res.files.length).to.eql(2);
      // expect(res.error).to.eql(undefined);
      // expect(res.files[0].source).to.eql('/foo/bar/kitten.jpg');
      // expect(res.files[0].target).to.eql('/cat.jpg');
      // expect(res.files[1].source).to.eql('/foo/bar/kitten.jpg');
      // expect(res.files[1].target).to.eql('/animals/feline.jpg');
      // expect(await mock.fileExists(path1.source)).to.eql(true);
      // expect(await mock.fileExists(path1.target)).to.eql(true);
      // expect(await mock.fileExists(path2.source)).to.eql(true);
      // expect(await mock.fileExists(path2.target)).to.eql(true);
    });

    it.skip('copy error (source not found)', async () => {
      // const mock = await TestPrep();
      // const res = await mock.events.io.copy.fire([
      //   { source: 'foo/bar/kitten.jpg', target: 'cat.jpg' },
      // ]);
      // await mock.dispose();
      // expect(res.files.length).to.eql(1);
      // expect(res.error?.code).to.eql('copy');
      // expect(res.error?.message).to.include('Failed while copying');
      // expect(res.files[0].error?.code).to.eql('copy');
      // expect(res.files[0].error?.message).to.include('no such file or directory');
    });
  });

  describe('move (copy + delete)', function () {
    // this.beforeEach(() => TestFs.reset());

    it.skip('move', async () => {
      // const mock = await TestPrep();
      // const src = await TestFs.readFile('static.test/child/kitten.jpg');
      // const { hash, data } = src;
      // const path = {
      //   source: 'foo/bar/kitten.jpg',
      //   target: 'cat.jpg',
      // };
      // await mock.events.io.write.fire({ path: path.source, hash, data });
      // expect(await mock.fileExists(path.source)).to.eql(true);
      // expect(await mock.fileExists(path.target)).to.eql(false);
      // const res = await mock.events.io.move.fire({ source: path.source, target: path.target });
      // await mock.dispose();
      // expect(res.files.length).to.eql(1);
      // expect(res.error).to.eql(undefined);
      // expect(res.files[0].source).to.eql('/foo/bar/kitten.jpg');
      // expect(res.files[0].target).to.eql('/cat.jpg');
      // expect(res.files[0].error).to.eql(undefined);
      // expect(await mock.fileExists(path.source)).to.eql(false);
      // expect(await mock.fileExists(path.target)).to.eql(true);
    });

    it.skip('error', async () => {
      // const mock = await TestPrep();
      // const path = {
      //   source: 'foo/bar/kitten.jpg',
      //   target: 'cat.jpg',
      // };
      // const res = await mock.events.io.move.fire({ source: path.source, target: path.target });
      // await mock.dispose();
      // expect(res.files.length).to.eql(1);
      // expect(res.error?.code).to.eql('move');
      // expect(res.error?.message).to.include('Failed while moving');
      // expect(res.files[0].source).to.eql('/foo/bar/kitten.jpg');
      // expect(res.files[0].target).to.eql('/cat.jpg');
      // expect(res.files[0].error?.code).to.eql('copy');
      // expect(res.files[0].error?.message).to.include('no such file or directory');
    });
  });
});
