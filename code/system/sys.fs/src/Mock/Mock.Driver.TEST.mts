import { describe, it, expect } from '../TEST/index.mjs';
import { FsMockDriver } from './index.mjs';

describe('Mock: FsDriver', () => {
  describe('driver.resolve', () => {
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
      const uri = '  path:foo/bar.txt  ';
      const mock = FsMockDriver();
      const res = await mock.driver.info(uri);

      expect(mock.count.info).to.eql(1);

      expect(res.uri).to.eql(uri.trim());
      expect(res.exists).to.eql(false);
      expect(res.kind).to.eql('unknown');
      expect(res.path).to.eql('/mock/foo/bar.txt');
      expect(res.hash).to.eql('');
      expect(res.bytes).to.eql(-1);
    });

    it('override info', async () => {
      const mock = FsMockDriver({}).onInfo((e) => {
        e.info.hash = 'sha256-abc';
        e.info.exists = true;
        e.info.kind = 'file';
        e.info.bytes = 1234;
      });

      const uri = '  path:foo/bar.txt  ';
      const res = await mock.driver.info(uri);

      expect(mock.count.info).to.eql(1);

      expect(res.uri).to.eql(uri.trim());
      expect(res.exists).to.eql(true);
      expect(res.kind).to.eql('file');
      expect(res.path).to.eql('/mock/foo/bar.txt');
      expect(res.hash).to.eql('sha256-abc');
      expect(res.bytes).to.eql(1234);
    });
  });
});
