import { Hash, Path, slug, Stream, t } from '../common';
import { describe, expect, it, MemoryMock, TestIndexedDb } from '../test';
import { IndexedDbDriver } from '../index.mjs';
import { DbLookup } from '../IndexedDb';

describe('FsIO (IndexedDB)', () => {
  const testCreate = async (options: { dir?: string } = {}) => {
    const { dir } = options;
    const id = `fs:test.${slug()}`;
    const fs = await IndexedDbDriver({ id, dir });
    const sample = MemoryMock.randomFile();
    return { fs, sample };
  };

  describe('paths', () => {
    it('default root directory', async (g) => {
      const { fs } = await testCreate();
      expect(fs.driver.io.dir).to.eql('/');
      fs.dispose();
    });

    it('custom root driver directory', async () => {
      const { fs } = await testCreate({ dir: 'root/foo' });
      expect(fs.driver.io.dir).to.eql('/root/foo/');
      fs.dispose();
    });

    it('resolve: to path', async () => {
      const { fs } = await testCreate();
      const test = (uri: string, expected: string) => {
        const path = fs.driver.io.resolve(uri);
        expect(path).to.eql(Path.join(fs.driver.io.dir, expected));
      };

      test('path:foo', 'foo');
      test('path:/foo', 'foo');
      test('path:///foo', 'foo');
      test('path:', '/');
      test('path:/', '/');
      test('path:///', '/');
      test('path:./foo', 'foo');

      fs.dispose();
    });

    it('resolve: throw if not "path:.." URI', async () => {
      const { fs } = await testCreate();
      const fn = () => fs.driver.io.resolve('foo');
      expect(fn).to.throw(/URI should start with \"path\:/);
      fs.dispose();
    });

    it('resolve: throw if out of scope', async () => {
      const { fs } = await testCreate();
      const fn = () => fs.driver.io.resolve('path:../foo');
      expect(fn).to.throw(/out of scope/);
      fs.dispose();
    });
  });

  describe('info', () => {
    it('no root dir', async () => {
      const { fs, sample } = await testCreate();
      const png = sample.data;
      const uri = 'path:foo/bird.png';
      await fs.driver.io.write(uri, png);

      const res = await fs.driver.io.info(` ${uri}  `);
      fs.dispose();

      expect(res.uri).to.eql(uri);
      expect(res.exists).to.eql(true);
      expect(res.path).to.eql('/foo/bird.png');
      expect(res.location).to.eql('file:///foo/bird.png');
      expect(res.hash).to.eql(sample.hash);
    });

    it('with root dir', async () => {
      const { fs, sample } = await testCreate({ dir: 'mock' });
      const png = sample.data;

      const uri = 'path:foo/bird.png';
      await fs.driver.io.write(uri, png);

      const res = await fs.driver.io.info(` ${uri}  `);
      fs.dispose();

      expect(res.uri).to.eql(uri);
      expect(res.exists).to.eql(true);
      expect(res.path).to.eql('/foo/bird.png');
      expect(res.location).to.eql('file:///mock/foo/bird.png');
      expect(res.hash).to.eql(sample.hash);
    });

    it('kind: "file"', async () => {
      const { fs, sample } = await testCreate();
      const uri = 'path:foo/bird.png';
      await fs.driver.io.write(uri, sample.data);

      const res = await fs.driver.io.info('path:foo/bird.png');
      expect(res.exists).to.eql(true);
      expect(res.kind).to.eql('file');
      expect(res.bytes).to.eql(sample.bytes);
      expect(res.hash).to.eql(sample.hash);

      fs.dispose();
    });

    it('kind: "dir"', async () => {
      const { fs, sample } = await testCreate();
      const uri = 'path:foo/bird.png';
      await fs.driver.io.write(uri, sample.data);

      const test = async (uri: string) => {
        const res = await fs.driver.io.info(uri);
        expect(res.uri).to.eql(uri);
        expect(res.exists).to.eql(true);
        expect(res.kind).to.eql('dir');
        expect(res.bytes).to.eql(-1);
        expect(res.hash).to.eql('');
      };

      await test('path:foo/');
      await test('path:foo');

      fs.dispose();
    });

    it('not found (404)', async () => {
      const { fs } = await testCreate();

      const uri = 'path:foo/404';
      const res = await fs.driver.io.info(uri);

      expect(res.uri).to.eql(uri);
      expect(res.exists).to.eql(false);
      expect(res.bytes).to.eql(-1);
      expect(res.hash).to.eql('');
      expect(res.kind).to.eql('unknown');
      expect(res.path).to.match(/foo\/404/);

      fs.dispose();
    });
  });

  describe('read/write', () => {
    it('read: binary (Uint8Array)', async () => {
      const { fs, sample } = await testCreate();

      const test = async (uri: string) => {
        const path = fs.driver.io.resolve(uri);
        await fs.driver.io.write(uri, sample.data);

        const res = await fs.driver.io.read(` ${uri} `);
        const file = res.file as t.FsDriverFile;

        expect(res.uri).to.eql(uri);
        expect(res.ok).to.eql(true);
        expect(res.status).to.eql(200);
        expect(res.error).to.eql(undefined);
        expect(file.location).to.eql(`file://${file.path}`);
        expect(file.path).to.eql(path);
        expect(file.data).to.eql(sample.data);
        expect(file.hash).to.eql(sample.hash);
      };

      await test('path:file:abc');
      await test('path:foo/bar/bird.png');

      fs.dispose();
    });

    it('write: binary (Uint8Array)', async () => {
      const { fs, sample } = await testCreate();

      const test = async (uri: string) => {
        const res = await fs.driver.io.write(`  ${uri} `, sample.data); // NB: URI padded with spaces (corrected internally).
        const file = res.file;
        expect(res.uri).to.eql(uri);
        expect(res.ok).to.eql(true);
        expect(res.status).to.eql(200);
        expect(res.error).to.eql(undefined);
        expect(file.location).to.eql(`file://${file.path}`);
        expect(file.path).to.eql(fs.driver.io.resolve(uri));
        expect(file.hash).to.match(/^sha256-[a-z0-9]+/);
        expect(file.data).to.eql(sample.data);
      };

      await test('path:foo:123');
      await test('path:foo/bar/bird.png');

      fs.dispose();
    });

    it('read/write - custom driver directory', async () => {
      const { fs, sample } = await testCreate({ dir: 'root' });
      const uri = 'path:a.png';
      const res1 = await fs.driver.io.write(uri, sample.data);

      expect(res1.file.path).to.eql('/a.png');
      expect(res1.file.location).to.eql('file:///root/a.png');

      // Check the raw database written entry.
      const lookup = DbLookup(fs.database);
      const entry = (await lookup.paths())[0];
      expect(entry.dir).to.eql('/root');
      expect(entry.path).to.eql('/a.png');

      const res2 = await fs.driver.io.read(uri);
      expect(res2.status).to.eql(200);
      expect(res2.file?.data).to.eql(sample.data);
      expect(res2.file?.path).to.eql('/a.png');
      expect(res2.file?.location).to.eql('file:///root/a.png');

      const info = await fs.driver.io.info(uri);
      expect(info.exists).to.eql(true);
      expect(info.path).to.eql('/a.png');
      expect(info.location).to.eql('file:///root/a.png');
    });

    it('read/write: "string" (TextEncoder | TextDecoder)', async () => {
      const { fs } = await testCreate();

      const uri = 'path:file.txt';
      const text = 'hello world!';
      const data = new TextEncoder().encode(text);

      const write = await fs.driver.io.write(uri, data);
      const read = await fs.driver.io.read(uri);

      expect(write.file.hash).to.eql(Hash.sha256(data));
      expect(write.file.bytes).to.eql(data.byteLength);

      expect(read.file?.data).to.eql(data);
      expect(read.file?.hash).to.eql(Hash.sha256(data));
      expect(read.file?.bytes).to.eql(data.byteLength);
      expect(new TextDecoder().decode(read.file?.data)).to.eql(text);

      fs.dispose();
    });

    it('step up path navigation ("../..")', async () => {
      const { fs, sample } = await testCreate();

      const root = slug();
      const path = `/${root}/zoo/file.txt`;
      const uri = `path:${root}/bar/baz/../../zoo/file.txt`;
      const res = await fs.driver.io.write(uri, sample.data);

      expect(res.file.path).to.eql(path);
      expect((await fs.driver.io.info(`path:${path}`)).exists).to.eql(true);

      fs.dispose();
    });

    it.skip('write: stream', async () => {
      const { fs } = await testCreate();
      const path = 'static/test/foo.json';
      const uri = `path:foo/${path}`;

      const body = (await fetch(path)).body as ReadableStream;
      expect(Stream.isReadableStream(body)).to.eql(true);

      const res1 = await fs.driver.io.write(uri, body);
      const res2 = await fs.driver.io.read(uri);
      fs.dispose();

      const decode = (input?: Uint8Array) => new TextDecoder().decode(input);

      expect(decode(res1.file.data)).to.include('"name": "foo"');
      expect(decode(res2.file?.data)).to.include('"name": "foo"');
    });

    it('write (replace)', async () => {
      const { fs } = await testCreate();
      const test = await TestIndexedDb.init(fs.id);

      const encode = (text: string) => new TextEncoder().encode(text);
      const uri = 'path:file.txt';

      const write1 = await fs.driver.io.write(uri, encode('hello'));
      const records1 = await test.getAll();

      expect(records1.paths.length).to.eql(1);
      expect(records1.files.length).to.eql(1);

      const write2 = await fs.driver.io.write(uri, encode('world'));
      const records2 = await test.getAll();

      expect(records2.paths.length).to.eql(1);
      expect(records2.files.length).to.eql(1); // NB: Still only a single file.
      expect(write1.file.path).to.eql(write2.file.path);
      expect(write1.file.hash).to.not.eql(write2.file.hash);

      fs.dispose();
    });
  });

  describe('delete', () => {
    it('delete (one)', async () => {
      const { fs } = await testCreate();
      const data = new TextEncoder().encode(slug());

      const test = async (uri: string) => {
        const path = fs.driver.io.resolve(uri);

        expect((await fs.driver.io.info(uri)).exists).to.eql(false);
        await fs.driver.io.write(uri, data);
        expect((await fs.driver.io.info(uri)).exists).to.eql(true);

        const res = await fs.driver.io.delete(uri);
        expect((await fs.driver.io.info(uri)).exists).to.eql(false);

        expect(res.ok).to.eql(true);
        expect(res.status).to.eql(200);
        expect(res.uris).to.eql([uri]);
        expect(res.locations[0]).to.eql(`file://${path}`);
      };

      await test(`path:${slug()}:123`);
      await test(`path:${slug()}/bar/bird.png`);

      fs.dispose();
    });

    it('delete (one, with second path reference remaining)', async () => {
      const { fs } = await testCreate();
      const data = new TextEncoder().encode(slug());

      const uri1 = `path:${slug()}/file1.txt`;
      const uri2 = `path:${slug()}/file2.txt`;

      await fs.driver.io.write(uri1, data);
      await fs.driver.io.write(uri2, data);

      expect((await fs.driver.io.info(uri1)).exists).to.eql(true);
      expect((await fs.driver.io.info(uri2)).exists).to.eql(true);

      await fs.driver.io.delete(uri1);
      expect((await fs.driver.io.info(uri1)).exists).to.eql(false);
      expect((await fs.driver.io.info(uri2)).exists).to.eql(true);

      await fs.driver.io.delete(uri2);
      expect((await fs.driver.io.info(uri1)).exists).to.eql(false);
      expect((await fs.driver.io.info(uri2)).exists).to.eql(false);

      fs.dispose();
    });

    it('delete (many)', async () => {
      const { fs } = await testCreate();
      const test = async (uri1: string, uri2: string) => {
        const png = new TextEncoder().encode(slug());
        const jpg = new TextEncoder().encode(slug());

        const path1 = fs.driver.io.resolve(uri1);
        const path2 = fs.driver.io.resolve(uri2);

        expect((await fs.driver.io.info(uri1)).exists).to.eql(false);
        expect((await fs.driver.io.info(uri2)).exists).to.eql(false);

        await fs.driver.io.write(uri1, png);
        await fs.driver.io.write(uri2, jpg);
        expect((await fs.driver.io.info(uri1)).exists).to.eql(true);
        expect((await fs.driver.io.info(uri2)).exists).to.eql(true);

        const res = await fs.driver.io.delete([uri1, uri2]);

        expect((await fs.driver.io.info(uri1)).exists).to.eql(false);
        expect((await fs.driver.io.info(uri2)).exists).to.eql(false);

        expect(res.ok).to.eql(true);
        expect(res.status).to.eql(200);
        expect(res.uris).to.eql([uri1, uri2]);
        expect(res.locations[0]).to.eql(`file://${path1}`);
        expect(res.locations[1]).to.eql(`file://${path2}`);
      };

      await test(`path:${slug()}:123`, `path:${slug()}:456`);
      await test(`path:${slug()}/bird.png`, `path:${slug()}/kitten.jpg`);
      await test(`path:${slug()}/bird.png`, `path:${slug()}:123`);

      fs.dispose();
    });

    it('delete (custom driver directory)', async () => {
      const { fs, sample } = await testCreate({ dir: 'root' });
      const uri = 'path:foo.png';
      await fs.driver.io.write(uri, sample.data);

      const res1 = await fs.driver.io.read(uri);
      expect(res1.status).to.eql(200);

      const info1 = await fs.driver.io.info(uri);
      expect(info1.exists).to.eql(true);
      expect(info1.path).to.eql('/foo.png');
      expect(info1.location).to.eql('file:///root/foo.png');

      const res2 = await fs.driver.io.delete(uri);
      expect(res2.status).to.eql(200);
      expect(res2.locations).to.eql(['file:///root/foo.png']);

      const info2 = await fs.driver.io.info(uri);
      const res3 = await fs.driver.io.read(uri);

      expect(info2.exists).to.eql(false);
      expect(res3.status).to.eql(404);
    });
  });

  describe('copy', () => {
    it('copy file', async () => {
      const { fs, sample } = await testCreate();
      const sourceUri = `path:${slug()}:bird1`;
      const targetUri = `path:${slug()}/foo.png`;

      expect((await fs.driver.io.read(targetUri)).status).to.eql(404);

      await fs.driver.io.write(sourceUri, sample.data);
      const res1 = await fs.driver.io.copy(sourceUri, targetUri);

      expect(res1.ok).to.eql(true);
      expect(res1.status).to.eql(200);
      expect(res1.source).to.eql(sourceUri);
      expect(res1.target).to.eql(targetUri);
      expect(res1.error).to.eql(undefined);

      const res2 = await fs.driver.io.read(sourceUri);
      const res3 = await fs.driver.io.read(targetUri);

      expect(res2.status).to.eql(200);
      expect(res2.file?.data).to.eql(sample.data);

      expect(res3.status).to.eql(200);
      expect(res3.file?.data).to.eql(sample.data);

      fs.dispose();
    });

    it('copy (custom driver directory)', async () => {
      const { fs, sample } = await testCreate({ dir: 'root/folder' });
      const sourceUri = `path:bird`;
      const targetUri = `path:/foo/bar.png`;

      await fs.driver.io.write(sourceUri, sample.data);
      const res1 = await fs.driver.io.copy(sourceUri, targetUri);

      expect(res1.ok).to.eql(true);
      expect(res1.status).to.eql(200);
      expect(res1.source).to.eql(sourceUri);
      expect(res1.target).to.eql(targetUri);
      expect(res1.error).to.eql(undefined);

      const res2 = await fs.driver.io.read(sourceUri);
      const res3 = await fs.driver.io.read(targetUri);

      expect(res2.status).to.eql(200);
      expect(res2.file?.data).to.eql(sample.data);
      expect(res2.file?.location).to.eql('file:///root/folder/bird');

      expect(res3.status).to.eql(200);
      expect(res3.file?.data).to.eql(sample.data);
      expect(res3.file?.location).to.eql('file:///root/folder/foo/bar.png');

      fs.dispose();
    });

    it('error: source file does not exist', async () => {
      const { fs } = await testCreate();
      const sourceUri = `path:${slug()}:bird`;
      const targetUri = `path:${slug()}/foo.png`;

      const res = await fs.driver.io.copy(sourceUri, targetUri);

      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(404);
      expect(res.error?.code).to.eql('fs:copy');
      expect(res.error?.message).to.include(`Failed to copy from [${sourceUri}] to [${targetUri}]`);
      expect(res.error?.message).to.include(`Source file not found`);

      fs.dispose();
    });
  });

  describe('errors', () => {
    it('fail: 404 while reading file', async () => {
      const { fs } = await testCreate();

      const uri = 'path:foo:noexist';
      const res = await fs.driver.io.read(` ${uri} `);
      const error = res.error as t.FsError;

      expect(res.uri).to.eql(uri);
      expect(res.ok).to.eql(false);
      expect(res.status).to.eql(404);
      expect(res.file).to.eql(undefined);
      expect(error.code).to.eql('fs:read');
      expect(error.path).to.eql(fs.driver.io.resolve(uri));
      expect(error.message).to.contain(`Not found`);

      fs.dispose();
    });

    it('fail: step up above root dir', async () => {
      const { fs, sample } = await testCreate();
      const png = sample.data;

      const res1 = await fs.driver.io.write('path:foo/bird.png', png);
      const res2 = await fs.driver.io.write('path:foo/../../bird.png', png);

      expect(res1.error).to.eql(undefined);
      expect(res2.error?.message).to.include('Failed to write');
      expect(res2.error?.message).to.include('out of scope');

      fs.dispose();
    });

    it('exception: no data', async () => {
      const { fs } = await testCreate();
      let message = '';
      try {
        await fs.driver.io.write('path:foo/bird.png', undefined as any);
      } catch (err: any) {
        message = err.message;
      }
      expect(message).to.include('No data');

      fs.dispose();
    });
  });
});
