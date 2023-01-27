import { describe, expect, Filesystem, it, MemoryMock, TestPrep } from '../test';
import { rx } from './common';

describe('BusController.IO', function () {
  describe('info', function () {
    it('defaults (no files)', async () => {
      const id = 'foo';
      const mock = TestPrep({ id });
      const info = await mock.events.io.info.get();

      expect(info.id).to.eql(id);
      expect(info.fs?.id).to.eql(id);
      expect(info.fs?.dir).to.eql(mock.driver.io.dir);
      expect(info.paths).to.eql([]);
      expect(info.error).to.eql(undefined);
    });

    it('not found', async () => {
      const mock = TestPrep();
      const info = await mock.events.io.info.get({ path: '/foo/bar.js', timeout: 10 });

      expect(info.paths.length).to.eql(1);
      const file = info.paths[0];

      expect(file.exists).to.eql(false);
      expect(file.hash).to.eql('');
      expect(file.bytes).to.eql(-1);
      expect(file.path).to.eql('/foo/bar.js');
    });

    it('file: single', async () => {
      const mock = TestPrep();
      const src = MemoryMock.randomFile();
      const path = '  foo/bar/kitty.jpg   '; // NB: spacing trimmed.
      await mock.events.io.write.fire({ path, hash: src.hash, data: src.data });

      const info = await mock.events.io.info.get({ path, timeout: 10 });
      expect(info.paths.length).to.eql(1);

      const file = info.paths[0];
      expect(file.kind).to.eql('file');
      expect(file.path).to.eql('/foo/bar/kitty.jpg'); // NB: starts at absolute "/"
      expect(file.hash).to.eql(src.hash);
      expect(file.bytes).to.eql(src.data.byteLength);
    });

    it('dir: single', async () => {
      const mock = TestPrep();
      const src = MemoryMock.randomFile();

      const path = '  foo/bar/kitty.jpg   '; // NB: spacing trimmed.
      await mock.events.io.write.fire({ path, hash: src.hash, data: src.data });

      const info = await mock.events.io.info.get({ path: '  foo/bar  ' });
      const dir = info.paths[0];

      expect(dir.kind).to.eql('dir');
      expect(dir.path).to.eql('/foo/bar/'); // NB: Ends with "/"
      expect(dir.hash).to.eql('');
      expect(dir.bytes).to.eql(-1);
    });

    it('multiple paths', async () => {
      const mock = TestPrep();
      const file = MemoryMock.randomFile();
      const path1 = '/foo/bar/kitty.jpg';
      const path2 = '/foo/bar/';

      await mock.events.io.write.fire({ path: path1, hash: file.hash, data: file.data });
      const info = await mock.events.io.info.get({ path: [path1, path2], timeout: 10 });

      expect(info.paths.length).to.eql(2);
      expect(info.paths[0].kind).to.eql('file');
      expect(info.paths[0].path).to.eql(path1);
      expect(info.paths[0].hash).to.eql(file.hash);
      expect(info.paths[0].bytes).to.eql(file.data.byteLength);
      expect(info.paths[1].kind).to.eql('dir');
      expect(info.paths[1].path).to.eql(path2);
      expect(info.paths[1].hash).to.eql('');
      expect(info.paths[1].bytes).to.eql(-1);
    });

    it('error: timeout', async () => {
      const bus = rx.bus();
      const events = Filesystem.Bus.Events({ id: 'bar', bus });
      const res = await events.io.info.get({ timeout: 10 });

      expect(res.error?.code).to.eql('fs:client/timeout');
      expect(res.error?.message).to.include('Timed out');
    });
  });

  describe('read', () => {
    it('reads file (single)', async () => {
      const mock = TestPrep();
      const png = MemoryMock.randomFile();
      await mock.driver.io.write('path:images/tree.png', png.data);

      const res = await mock.events.io.read.get('images/tree.png');

      expect(res.error).to.eql(undefined);
      expect(res.files.length).to.eql(1);

      const files = res.files.map(({ file }) => file);
      expect(files[0]?.hash).to.eql(png.hash);
      expect(files[0]?.data).to.eql(png.data);
    });

    it('reads files (multiple)', async () => {
      const mock = TestPrep();
      const image1 = MemoryMock.randomFile();
      const image2 = MemoryMock.randomFile(500);

      await mock.driver.io.write('path:/images/tree.png', image1.data);
      await mock.driver.io.write('path:images/kitten.jpg', image2.data);

      const res = await mock.events.io.read.get(['/images/tree.png', 'images/kitten.jpg']);
      expect(res.error).to.eql(undefined);
      expect(res.files.length).to.eql(2);

      const files = res.files.map(({ file }) => file);
      expect(files[0]?.hash).to.eql(image1.hash);
      expect(files[1]?.hash).to.eql(image2.hash);

      expect(image1.data).to.eql(files[0]?.data);
      expect(image2.data).to.eql(files[1]?.data);
    });

    it('error: "read/404"', async () => {
      const mock = TestPrep();
      const res = await mock.events.io.read.get('path:images/tree.png');
      const file = res.files[0];

      expect(res.error?.code).to.eql('fs:read');
      expect(res.error?.message).to.include('Failed while reading');
      expect(file.error?.code).to.eql('fs:read/404');
      expect(file.error?.message).to.include('File not found');
      expect(file.error?.path).to.eql('/images/tree.png');
    });
  });

  describe('write', function () {
    it('writes file (single)', async () => {
      const mock = TestPrep();
      const src = MemoryMock.randomFile();

      const { hash, data } = src;
      const path = 'path:foo/bar/kitten.jpg';
      const res = await mock.events.io.write.fire({ path, hash, data });

      expect(res.error).to.eql(undefined);
      expect(res.files.length).to.eql(1);
      expect(res.files[0].path).to.eql('/foo/bar/kitten.jpg'); // Absolute path ("/..") starting at [fs.dir] root.
      expect(res.files[0].hash).to.eql(src.hash);

      const after = await mock.driver.io.read(path);
      expect(after.file?.hash).to.eql(hash);
      expect(after.file?.data).to.eql(data);
    });

    it('write files (multiple)', async () => {
      const mock = TestPrep();
      const src1 = MemoryMock.randomFile();
      const src2 = MemoryMock.randomFile();

      const PATH = {
        kitten: 'path:foo/bar/kitten.jpg',
        tree: 'path:foo/bar/tree.png',
      };
      expect(await mock.fileExists(PATH.kitten)).to.eql(false);
      expect(await mock.fileExists(PATH.tree)).to.eql(false);

      const res = await mock.events.io.write.fire([
        { path: PATH.kitten, hash: src1.hash, data: src1.data },
        { path: PATH.tree, hash: src2.hash, data: src2.data },
      ]);

      expect(res.error).to.eql(undefined);
      expect(res.files.length).to.eql(2);
      expect(res.files[0].path).to.eql('/foo/bar/kitten.jpg');
      expect(res.files[1].path).to.eql('/foo/bar/tree.png');
      expect(res.files[0].hash).to.eql(src1.hash);
      expect(res.files[1].hash).to.eql(src2.hash);

      expect(await mock.fileExists(PATH.kitten)).to.eql(true);
      expect(await mock.fileExists(PATH.tree)).to.eql(true);

      const after1 = await mock.driver.io.read(PATH.kitten);
      const after2 = await mock.driver.io.read(PATH.tree);

      expect(after1.file?.hash).to.eql(src1.hash);
      expect(after1.file?.data).to.eql(src1.data);

      expect(after2.file?.hash).to.eql(src2.hash);
      expect(after2.file?.data).to.eql(src2.data);
    });
  });

  describe('delete', function () {
    it('delete (does not exist)', async () => {
      const mock = TestPrep();
      const res = await mock.events.io.delete.fire('foo/404.txt');

      expect(res.files.length).to.eql(1);
      expect(res.files[0].path).to.eql('/foo/404.txt');
      expect(res.files[0].hash).to.eql('');
      expect(res.files[0].existed).to.eql(false);
      expect(res.files[0].error).to.eql(undefined);
    });

    it('delete (single)', async () => {
      const mock = TestPrep();
      const src = MemoryMock.randomFile();
      const { hash, data } = src;
      const path = 'foo/bar/kitten.jpg';

      await mock.events.io.write.fire({ path, hash, data });
      expect(await mock.fileExists(path)).to.eql(true);

      const res = await mock.events.io.delete.fire(path);
      expect(await mock.fileExists(path)).to.eql(false);

      expect(res.files.length).to.eql(1);
      expect(res.files[0].path).to.eql('/foo/bar/kitten.jpg');
      expect(res.files[0].existed).to.eql(true);
      expect(res.files[0].hash).to.eql(hash);
      expect(res.files[0].error).to.eql(undefined);
    });

    it('delete (multiple)', async () => {
      const mock = TestPrep();

      const src1 = MemoryMock.randomFile();
      const src2 = MemoryMock.randomFile();

      const path1 = 'foo/bar/milk.jpg';
      const path2 = 'foo/bar/green.png';
      await mock.events.io.write.fire([
        { path: path1, hash: src1.hash, data: src1.data },
        { path: path2, hash: src2.hash, data: src2.data },
      ]);

      expect(await mock.fileExists(path1)).to.eql(true);
      expect(await mock.fileExists(path2)).to.eql(true);

      const res = await mock.events.io.delete.fire([path1, path2]);
      expect(await mock.fileExists(path1)).to.eql(false);
      expect(await mock.fileExists(path2)).to.eql(false);

      expect(res.files.length).to.eql(2);
      expect(res.files[0].path).to.eql('/foo/bar/milk.jpg');
      expect(res.files[0].error).to.eql(undefined);
      expect(res.files[1].path).to.eql('/foo/bar/green.png');
      expect(res.files[1].error).to.eql(undefined);
    });
  });

  describe('copy', function () {
    it('copy (single)', async () => {
      const mock = TestPrep();
      const src = MemoryMock.randomFile();
      const { hash, data } = src;
      const PATH = {
        source: 'foo/bar/kitten.jpg',
        target: 'cat.jpg',
      };

      await mock.events.io.write.fire({ path: PATH.source, hash, data });
      expect(await mock.fileExists(PATH.source)).to.eql(true);
      expect(await mock.fileExists(PATH.target)).to.eql(false);

      const res = await mock.events.io.copy.fire({ source: PATH.source, target: PATH.target });

      expect(res.error).to.eql(undefined);
      expect(res.files.length).to.eql(1);
      expect(res.files[0].source).to.eql('/foo/bar/kitten.jpg');
      expect(res.files[0].target).to.eql('/cat.jpg');

      expect(await mock.fileExists(PATH.source)).to.eql(true);
      expect(await mock.fileExists(PATH.target)).to.eql(true);
    });

    it('copy (multiple)', async () => {
      const mock = TestPrep();
      const src = MemoryMock.randomFile();
      const { hash, data } = src;
      const PATH1 = {
        source: 'foo/bar/kitten.jpg',
        target: 'cat.jpg',
      };
      const PATH2 = {
        source: 'foo/bar/kitten.jpg',
        target: 'animals/feline.jpg',
      };
      await mock.events.io.write.fire({ path: PATH1.source, hash, data });
      expect(await mock.fileExists(PATH1.source)).to.eql(true);

      const res = await mock.events.io.copy.fire([
        { source: PATH1.source, target: PATH1.target },
        { source: PATH2.source, target: PATH2.target },
      ]);

      expect(res.files.length).to.eql(2);
      expect(res.error).to.eql(undefined);
      expect(res.files[0].source).to.eql('/foo/bar/kitten.jpg');
      expect(res.files[0].target).to.eql('/cat.jpg');
      expect(res.files[1].source).to.eql('/foo/bar/kitten.jpg');
      expect(res.files[1].target).to.eql('/animals/feline.jpg');

      expect(await mock.fileExists(PATH1.source)).to.eql(true);
      expect(await mock.fileExists(PATH1.target)).to.eql(true);
      expect(await mock.fileExists(PATH2.source)).to.eql(true);
      expect(await mock.fileExists(PATH2.target)).to.eql(true);
    });

    it('copy error (source not found)', async () => {
      const mock = TestPrep();
      const res = await mock.events.io.copy.fire([
        { source: 'foo/bar/kitten.jpg', target: 'cat.jpg' },
      ]);

      expect(res.files.length).to.eql(1);

      expect(res.error?.code).to.eql('fs:copy');
      expect(res.error?.message).to.include('Failed while copying');

      expect(res.files[0].error?.code).to.eql('fs:copy');
      expect(res.files[0].error?.message).to.include('Source file not found');
    });
  });

  describe('move (copy + delete)', function () {
    it('move', async () => {
      const mock = TestPrep();
      const src = MemoryMock.randomFile();
      const { hash, data } = src;
      const PATH = {
        source: 'foo/bar/kitten.jpg',
        target: 'cat.jpg',
      };

      await mock.events.io.write.fire({ path: PATH.source, hash, data });
      expect(await mock.fileExists(PATH.source)).to.eql(true);
      expect(await mock.fileExists(PATH.target)).to.eql(false);

      const res = await mock.events.io.move.fire({ source: PATH.source, target: PATH.target });

      expect(res.files.length).to.eql(1);
      expect(res.error).to.eql(undefined);
      expect(res.files[0].source).to.eql('/foo/bar/kitten.jpg');
      expect(res.files[0].target).to.eql('/cat.jpg');
      expect(res.files[0].error).to.eql(undefined);

      expect(await mock.fileExists(PATH.source)).to.eql(false);
      expect(await mock.fileExists(PATH.target)).to.eql(true);
    });

    it('error', async () => {
      const mock = TestPrep();
      const PATH = {
        source: 'foo/bar/kitten.jpg',
        target: 'cat.jpg',
      };
      const res = await mock.events.io.move.fire({ source: PATH.source, target: PATH.target });

      expect(res.files.length).to.eql(1);
      expect(res.error?.code).to.eql('fs:move');
      expect(res.error?.message).to.include('Failed while moving');
      expect(res.files[0].source).to.eql('/foo/bar/kitten.jpg');
      expect(res.files[0].target).to.eql('/cat.jpg');

      expect(res.files[0].error?.code).to.eql('fs:copy');
      expect(res.files[0].error?.message).to.include('not found');
    });
  });
});
