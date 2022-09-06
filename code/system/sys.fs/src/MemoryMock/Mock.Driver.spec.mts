import { t, describe, expect, it } from '../TEST/index.mjs';
import { FsMockDriver, MemoryMock } from './index.mjs';

const ResolveSpec = (factory: t.FsDriverFactory) => {
  describe('resolve', () => {
    it('default root directory', async () => {
      const driver = await factory();
      const resolve = driver.resolve;
      expect(resolve('path:.')).to.eql(driver.dir);
    });

    it('custom root directory', async () => {
      const driver = await factory('  foo/bar  ');
      const resolve = driver.resolve;

      const res1 = resolve('path:.');
      const res2 = resolve('path:dir/file.txt');

      expect(res1).to.eql('/foo/bar/');
      expect(res2).to.eql('/foo/bar/dir/file.txt');
    });
  });
};

const InfoSpec = (factory: t.FsDriverFactory) => {};

const ReadWriteSpec = (factory: t.FsDriverFactory) => {};

const CopySpec = (factory: t.FsDriverFactory) => {};

const DeleteSpec = (factory: t.FsDriverFactory) => {};

export const DriverSpec = {
  ResolveSpec,
  InfoSpec,
  ReadWriteSpec,
  CopySpec,
  DeleteSpec,

  every(factory: t.FsDriverFactory) {
    ResolveSpec(factory);
    InfoSpec(factory);
    ReadWriteSpec(factory);
    CopySpec(factory);
    DeleteSpec(factory);
  },
};

export default DriverSpec;

describe('Mock: FsDriver', () => {
  describe('resolve', () => {
    it('default root directory', () => {
      const mock = FsMockDriver();
      const resolve = mock.driver.resolve;
      const res = resolve('path:.');
      expect(res).to.eql('/mock/');
    });

    it('custom root directory', () => {
      const mock = FsMockDriver({ dir: '  foo/bar  ' });
      const resolve = mock.driver.resolve;

      const res1 = resolve('path:.');
      const res2 = resolve('path:dir/file.txt');
      expect(res1).to.eql('/foo/bar/');
      expect(res2).to.eql('/foo/bar/dir/file.txt');
    });
  });

  describe('info', () => {
    it('no handler', async () => {
      const mock = FsMockDriver();
      const uri = '  path:foo/bar.txt  ';
      const res = await mock.driver.info(uri);

      expect(res.uri).to.eql(uri.trim());
      expect(res.exists).to.eql(false);
      expect(res.kind).to.eql('unknown');
      expect(res.path).to.eql('/foo/bar.txt');
      expect(res.location).to.eql('file:///mock/foo/bar.txt');
      expect(res.hash).to.eql('');
      expect(res.bytes).to.eql(-1);
    });

    it('root directory ("path:.")', async () => {
      const test = async (path: string) => {
        const mock = FsMockDriver();
        const res = await mock.driver.info(path);

        expect(res.exists).to.eql(true);
        expect(res.uri).to.eql('path:/');
        expect(res.path).to.eql('/');
        expect(res.location).to.eql('file:///mock/');
        expect(res.hash).to.eql('');
        expect(res.bytes).to.eql(-1);
      };

      await test('path:/');
      await test('path:'); // NB: root "/" inferred.
      await test('  path:.  ');
    });

    it('override info', async () => {
      const mock = FsMockDriver({}).onInfoRequest((e) => {
        e.info.hash = 'sha256-abc';
        e.info.exists = true;
        e.info.kind = 'file';
        e.info.bytes = 1234;
      });

      const uri = '  path:foo/bar.txt  ';
      const res = await mock.driver.info(uri);

      expect(res.uri).to.eql(uri.trim());
      expect(res.exists).to.eql(true);
      expect(res.kind).to.eql('file');
      expect(res.path).to.eql('/foo/bar.txt');
      expect(res.location).to.eql('file:///mock/foo/bar.txt');
      expect(res.hash).to.eql('sha256-abc');
      expect(res.bytes).to.eql(1234);
    });

    it('info.kind: "file" | "dir" | "unknown"', async () => {
      const uri = 'path:foo/bar/file.txt';
      const mock = FsMockDriver();

      const file = MemoryMock.randomFile();
      await mock.driver.write(uri, file.data);

      const res1 = await mock.driver.info(uri);
      const res2 = await mock.driver.info('path:foo/bar');
      const res3 = await mock.driver.info('path:foo/bar/');
      const res4 = await mock.driver.info('path:404');

      expect(res1.kind).to.eql('file');
      expect(res2.kind).to.eql('dir');
      expect(res3.kind).to.eql('dir');
      expect(res4.kind).to.eql('unknown');
    });
  });

  describe('read/write', () => {
    it('write', async () => {
      const mock = FsMockDriver();
      const uri = '  path:foo/bar.png  ';
      const png = MemoryMock.randomFile();

      const res = await mock.driver.write(uri, png.data);

      expect(res.uri).to.eql('path:foo/bar.png');
      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.file.data).to.eql(png.data);
      expect(res.file.hash).to.eql(png.hash);
      expect(res.file.path).to.eql('/foo/bar.png');
      expect(res.file.location).to.eql('file:///mock/foo/bar.png');
      expect(res.error).to.eql(undefined);
    });

    it('read: not found (404)', async () => {
      const mock = FsMockDriver();
      const uri = '  path:/foo/bar.png  ';

      const res = await mock.driver.read(uri);

      expect(res.uri).to.eql('path:/foo/bar.png');
      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(404);
      expect(res.file).to.eql(undefined);
      expect(res.error?.code).to.eql('fs:read');
      expect(res.error?.path).to.eql('/foo/bar.png');
    });

    it('read (200)', async () => {
      const mock = FsMockDriver();
      const uri = 'path:foo/bar.png';
      const png = MemoryMock.randomFile();

      await mock.driver.write(uri, png.data);

      const res = await mock.driver.read(uri);

      expect(res.uri).to.eql(uri);
      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.file?.data).to.eql(png.data);
      expect(res.file?.hash).to.eql(png.hash);
      expect(res.file?.path).to.eql('/foo/bar.png');
      expect(res.file?.location).to.eql('file:///mock/foo/bar.png');
      expect(res.error).to.eql(undefined);
    });

    it('write/read - remove leading slash', async () => {
      const mock = FsMockDriver();
      const file = MemoryMock.randomFile();

      await mock.driver.write('path:/foo/bar.txt', file.data);

      const res = await mock.driver.read('path:foo/bar.txt');
      expect(res.status).to.eql(200);
    });
  });

  describe('delete', () => {
    it('nothing to delete', async () => {
      const mock = FsMockDriver();
      const uri = 'path:foo/bar.png';

      const res = await mock.driver.delete(uri);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.uris).to.eql([]);
      expect(res.locations).to.eql([]);
    });

    it('single file', async () => {
      const mock = FsMockDriver();

      const path = '  path:foo/bar.png  ';
      const png = MemoryMock.randomFile();
      await mock.driver.write(path, png.data);

      const res = await mock.driver.delete(path);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.uris).to.eql(['path:foo/bar.png']);
      expect(res.locations).to.eql(['file:///mock/foo/bar.png']);
    });

    it('many files', async () => {
      const mock = FsMockDriver();

      const file1 = MemoryMock.randomFile();
      const file2 = MemoryMock.randomFile(500);
      await mock.driver.write('path:foo/bar.png', file1.data);
      await mock.driver.write('path:thing.pdf', file2.data);

      const res = await mock.driver.delete(['path:foo/bar.png', 'path:404', 'path:thing.pdf']);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.uris).to.eql(['path:foo/bar.png', 'path:thing.pdf']);
      expect(res.locations).to.eql(['file:///mock/foo/bar.png', 'file:///mock/thing.pdf']);
    });
  });

  describe('copy', () => {
    it('copy file', async () => {
      const mock = FsMockDriver();

      const png = MemoryMock.randomFile();
      await mock.driver.write('path:foo.png', png.data);

      const res = await mock.driver.copy('path:foo.png', 'path:images/bird.png');

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.source).to.eql('path:foo.png');
      expect(res.target).to.eql('path:images/bird.png');
      expect(res.error).to.eql(undefined);

      // Ensure the file is copied.
      const from = await mock.driver.read('path:foo.png');
      const to = await mock.driver.read('path:images/bird.png');
      expect(from.status).to.eql(200);
      expect(to.status).to.eql(200);
    });

    it('404 - source not found', async () => {
      const mock = FsMockDriver();
      const res = await mock.driver.copy('path:foo.png', 'path:images/bird.png');

      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(404);
      expect(res.source).to.eql('path:foo.png');
      expect(res.target).to.eql('path:images/bird.png');
      expect(res.error?.code).to.eql('fs:copy');
      expect(res.error?.path).to.eql('foo.png');
      expect(res.error?.message).to.include('Source file not found');
    });
  });

  describe('throw on step-up out of root directory', () => {
    it('read', async () => {
      const mock = FsMockDriver();
      const png = MemoryMock.randomFile();
      await mock.driver.write('path:foo.png', png.data);

      const res1 = await mock.driver.read('path:foo.png');
      expect(res1.ok).to.eql(true);

      const res2 = await mock.driver.read('path:../foo.png');
      expect(res2.ok).to.eql(false);
      expect(res2.status).to.eql(422);
      expect(res2.error?.message).to.include('Path out of scope');
    });

    it('write', async () => {
      const mock = FsMockDriver();
      const png = MemoryMock.randomFile();

      const res = await mock.driver.write('path:../foo.png', png.data);

      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(422);
      expect(res.error?.message).to.include('Path out of scope');
    });

    it('delete', async () => {
      const mock = FsMockDriver();

      const res1 = await mock.driver.delete('path:../foo.png');
      const res2 = await mock.driver.delete([
        'path:../foo.png',
        'path:bar.png',
        'path:../../bar.png',
      ]);

      expect(res1.ok).to.eql(false);
      expect(res1.status).to.eql(422);
      expect(res1.error?.message).to.include('Path out of scope');
      expect(res1.error?.path).to.include('../foo.png');

      expect(res2.ok).to.eql(false);
      expect(res2.status).to.eql(422);
      expect(res2.error?.message).to.include('Path out of scope');
      expect(res2.error?.path).to.include('../foo.png; ../../bar.png');
    });

    it('copy', async () => {
      const mock = FsMockDriver();

      const res1 = await mock.driver.copy('path:../foo.png', 'path:foo.png');
      const res2 = await mock.driver.copy('path:foo.png', 'path:../foo.png');

      expect(res1.ok).to.eql(false);
      expect(res1.status).to.eql(422);
      expect(res1.error?.message).to.include('Source path out of scope');
      expect(res1.error?.path).to.include('../foo.png');

      expect(res2.ok).to.eql(false);
      expect(res2.status).to.eql(422);
      expect(res2.error?.message).to.include('Target path out of scope');
      expect(res2.error?.path).to.include('../foo.png');
    });
  });
});
