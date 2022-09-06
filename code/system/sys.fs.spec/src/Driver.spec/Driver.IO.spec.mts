import { t, MemoryMock, expect } from './common.mjs';

const ResolveSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;
  describe('resolve', () => {
    it('default root directory', async () => {
      const driver = (await factory()).io;
      const resolve = driver.resolve;
      expect(resolve('path:.')).to.eql('/mock/');
    });

    it('custom root directory', async () => {
      const driver = (await factory('  foo/bar  ')).io;
      const resolve = driver.resolve;

      const res1 = resolve('path:.');
      const res2 = resolve('path:dir/file.txt');

      expect(res1).to.eql('/foo/bar/');
      expect(res2).to.eql('/foo/bar/dir/file.txt');
    });
  });
};

const InfoSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('info', () => {
    it('no handler', async () => {
      const driver = (await factory()).io;
      const uri = '  path:foo/bar.txt  ';
      const res = await driver.info(uri);

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
        const driver = (await factory()).io;
        const res = await driver.info(path);

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

    it('info.kind: "file" | "dir" | "unknown"', async () => {
      const uri = 'path:foo/bar/file.txt';
      const driver = (await factory()).io;

      const file = MemoryMock.randomFile();
      await driver.write(uri, file.data);

      const res1 = await driver.info(uri);
      const res2 = await driver.info('path:foo/bar');
      const res3 = await driver.info('path:foo/bar/');
      const res4 = await driver.info('path:404');

      expect(res1.kind).to.eql('file');
      expect(res2.kind).to.eql('dir');
      expect(res3.kind).to.eql('dir');
      expect(res4.kind).to.eql('unknown');
    });
  });
};

const ReadWriteSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('read/write', () => {
    it('write', async () => {
      const driver = (await factory()).io;
      const uri = '  path:foo/bar.png  ';
      const png = MemoryMock.randomFile();

      const res = await driver.write(uri, png.data);

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
      const driver = (await factory()).io;
      const uri = '  path:/foo/bar.png  ';
      const res = await driver.read(uri);

      expect(res.uri).to.eql('path:/foo/bar.png');
      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(404);
      expect(res.file).to.eql(undefined);
      expect(res.error?.code).to.eql('fs:read');
      expect(res.error?.path).to.eql('/foo/bar.png');
    });

    it('read (200)', async () => {
      const driver = (await factory()).io;
      const uri = 'path:foo/bar.png';
      const png = MemoryMock.randomFile();

      await driver.write(uri, png.data);

      const res = await driver.read(uri);

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
      const driver = (await factory()).io;
      const file = MemoryMock.randomFile();

      await driver.write('path:/foo/bar.txt', file.data);

      const res = await driver.read('path:foo/bar.txt');
      expect(res.status).to.eql(200);
    });
  });
};

const CopySpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('copy', () => {
    it('copy file', async () => {
      const driver = (await factory()).io;
      const png = MemoryMock.randomFile();

      await driver.write('path:foo.png', png.data);
      const res = await driver.copy('path:foo.png', 'path:images/bird.png');

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.source).to.eql('path:foo.png');
      expect(res.target).to.eql('path:images/bird.png');
      expect(res.error).to.eql(undefined);

      // Ensure the file is copied.
      const from = await driver.read('path:foo.png');
      const to = await driver.read('path:images/bird.png');

      expect(from.status).to.eql(200);
      expect(to.status).to.eql(200);

      expect(from.file?.hash).to.eql(png.hash);
      expect(to.file?.hash).to.eql(png.hash);
    });

    it('404 - source not found', async () => {
      const driver = (await factory()).io;
      const res = await driver.copy('path:foo.png', 'path:images/bird.png');

      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(404);
      expect(res.source).to.eql('path:foo.png');
      expect(res.target).to.eql('path:images/bird.png');
      expect(res.error?.code).to.eql('fs:copy');
      expect(res.error?.path).to.eql('foo.png');
      expect(res.error?.message).to.include('Source file not found');
    });
  });
};

const DeleteSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('delete', () => {
    it('nothing to delete', async () => {
      const driver = (await factory()).io;

      const uri = 'path:foo/bar.png';
      const file = MemoryMock.randomFile();
      await driver.write(uri, file.data);

      const res = await driver.delete(uri);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);

      expect(res.uris).to.eql(['path:foo/bar.png']);
      expect(res.locations).to.eql(['file:///mock/foo/bar.png']);
    });

    it('single file', async () => {
      const mock = MemoryMock.IO();

      const path = '  path:foo/bar.png  ';
      const png = MemoryMock.randomFile();
      await mock.io.write(path, png.data);

      const res = await mock.io.delete(path);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.uris).to.eql(['path:foo/bar.png']);
      expect(res.locations).to.eql(['file:///mock/foo/bar.png']);
    });

    it('many files', async () => {
      const mock = MemoryMock.IO();

      const file1 = MemoryMock.randomFile();
      const file2 = MemoryMock.randomFile(500);
      await mock.io.write('path:foo/bar.png', file1.data);
      await mock.io.write('path:thing.pdf', file2.data);

      const res = await mock.io.delete(['path:foo/bar.png', 'path:404', 'path:thing.pdf']);

      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);
      expect(res.uris).to.eql(['path:foo/bar.png', 'path:thing.pdf']);
      expect(res.locations).to.eql(['file:///mock/foo/bar.png', 'file:///mock/thing.pdf']);
    });
  });
};

const ExceptionsSpec = (ctx: t.SpecContext) => {
  const { describe, it, factory } = ctx;

  describe('throw on step-up out of root directory', () => {
    it('read', async () => {
      const driver = (await factory()).io;
      const png = MemoryMock.randomFile();
      await driver.write('path:foo.png', png.data);

      const res1 = await driver.read('path:foo.png');
      expect(res1.ok).to.eql(true);

      const res2 = await driver.read('path:../foo.png');
      expect(res2.ok).to.eql(false);
      expect(res2.status).to.eql(422);
      expect(res2.error?.message).to.include('Path out of scope');
    });

    it('write', async () => {
      const driver = (await factory()).io;

      const png = MemoryMock.randomFile();

      const res = await driver.write('path:../foo.png', png.data);

      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(422);
      expect(res.error?.message).to.include('Path out of scope');
    });

    it('delete', async () => {
      const driver = (await factory()).io;

      const res1 = await driver.delete('path:../foo.png');
      const res2 = await driver.delete(['path:../foo.png', 'path:bar.png', 'path:../../bar.png']);

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
      const driver = (await factory()).io;

      const res1 = await driver.copy('path:../foo.png', 'path:foo.png');
      const res2 = await driver.copy('path:foo.png', 'path:../foo.png');

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
};

/**
 * Functional Specification: Driver (I/O)
 */
export const FsIOSpec = {
  ResolveSpec,
  InfoSpec,
  ReadWriteSpec,
  CopySpec,
  DeleteSpec,
  ExceptionsSpec,

  every(ctx: t.SpecContext) {
    ResolveSpec(ctx);
    InfoSpec(ctx);
    ReadWriteSpec(ctx);
    CopySpec(ctx);
    DeleteSpec(ctx);
    ExceptionsSpec(ctx);
  },
};
