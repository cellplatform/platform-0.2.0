import { describe, it, expect, MemoryMock, TEST_PATH, expectError } from '../TEST/index.mjs';
import { FsDriver } from './index.mjs';
import { Hash } from '../common/index.mjs';
import { NodeFs } from '../node/NodeFs/index.mjs';

const TMP = TEST_PATH.tmp;

describe('FsDriver (Node)', () => {
  const testCreate = async () => {
    const dir = TMP;
    await NodeFs.remove(TEST_PATH.tmp);
    await NodeFs.ensureDir(dir);

    const driver = FsDriver({ dir });
    return { driver };
  };

  describe('paths', () => {
    it('default', () => {
      const driver = FsDriver();
      expect(driver.dir).to.eql('/');
    });

    it('custon root directory', () => {
      const driver = FsDriver({ dir: ' foo/bar// ' });
      expect(driver.dir).to.eql('/foo/bar/');
    });

    it('resolve: cannot step above root directory (security)', async () => {
      const { driver } = await testCreate();
      const length = driver.dir.split('/').length;
      const uri = `path:${'../'.repeat(length + 3)}`;
      expect(driver.resolve(uri)).to.eql(driver.dir);
    });
  });

  describe('info', () => {
    it('unknown: does not exist', async () => {
      const { driver } = await testCreate();
      const res = await driver.info('path:foo/bar/');
      expect(res.exists).to.eql(false);
      expect(res.uri).to.eql('path:foo/bar/');
      expect(res.kind).to.eql('unknown');
      expect(res.path).to.eql('/foo/bar/');
      expect(res.hash).to.eql(''); // No hashing for directory.
      expect(res.bytes).to.eql(-1); // Byte size for file only.
    });

    it('dir: root', async () => {
      const { driver } = await testCreate();
      const uri = 'path:/';
      const res = await driver.info(` ${uri}  `);

      expect(res.exists).to.eql(true);
      expect(res.uri).to.eql('path:/');
      expect(res.kind).to.eql('dir');
      expect(res.location).to.eql(`file://${driver.dir}`);
      expect(res.path).to.eql('/');
      expect(res.hash).to.eql(''); // No hashing for directory.
      expect(res.bytes).to.greaterThan(60);
    });

    it('file', async () => {
      const { driver } = await testCreate();

      const path = NodeFs.join(TMP, 'foo.txt');
      await NodeFs.writeFile(path, 'Hello world!');

      const res = await driver.info('path:foo.txt');

      expect(res.exists).to.eql(true);
      expect(res.uri).to.eql('path:foo.txt');
      expect(res.kind).to.eql('file');
      expect(res.location).to.eql(`file://${driver.dir}foo.txt`);
      expect(res.path).to.eql('/foo.txt');
      expect(res.hash.startsWith('sha256-')).to.eql(true);
      expect(res.hash.endsWith('ffcbb7df31ad9e51a')).to.eql(true);
      expect(res.bytes).to.eql(12);
    });

    it('throw: not a "path:.." URI', async () => {
      const { driver } = await testCreate();
      const fn = () => driver.info('foo/bar.png');
      await expectError(fn, 'Invalid URI');
    });
  });

  describe('read', () => {
    it('read file (exists)', async () => {
      const { driver } = await testCreate();

      const path = NodeFs.join(TMP, 'foo.txt');
      await NodeFs.writeFile(path, 'Hello world!');
      const buffer = await NodeFs.readFile(path);

      const uri = 'path:foo.txt';
      const res = await driver.read(uri);

      expect(res.uri).to.eql(uri);
      expect(res.ok).to.eql(true);
      expect(res.status).to.eql(200);

      expect(res.file?.path).to.eql('/foo.txt');
      expect(res.file?.location).to.eql(`file://${driver.dir}foo.txt`);
      expect(res.file?.data).to.eql(new Uint8Array(buffer));
      expect(res.file?.bytes).to.eql(buffer.byteLength);
      expect(res.file?.hash).to.eql(Hash.sha256(buffer));
    });
  });
});
