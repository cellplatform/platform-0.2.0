import { describe, it, expect } from '../TEST/index.mjs';
import { FsMockIndexer } from './index.mjs';

describe('Mock: FsIndexer', () => {
  describe('dir', () => {
    it('default', () => {
      const mock = FsMockIndexer();
      expect(mock.indexer.dir).to.eql('/mock/');
    });

    it('custom', () => {
      const mock = FsMockIndexer({ dir: '/foo/bar/' });
      expect(mock.indexer.dir).to.eql('/foo/bar/');
    });
  });

  describe('manifest', () => {
    it('default (no handler)', async () => {
      const mock = FsMockIndexer();
      const res = await mock.indexer.manifest();
      expect(mock.count.manifest).to.eql(1);

      expect(typeof res.dir.indexedAt).to.eql('number');
      expect(res.kind).to.eql('dir');
      expect(res.hash.dir).to.eql('');
      expect(res.hash.files).to.eql('');
      expect(res.files).to.eql([]);
    });

    it('override manifest handler', async () => {
      const mock = FsMockIndexer().onManifest((e) => {
        e.manifest.hash.dir = 'abcd';
        e.manifest.hash.files = '1234';
      });
      const res = await mock.indexer.manifest();
      expect(mock.count.manifest).to.eql(1);

      expect(res.hash.dir).to.eql('abcd');
      expect(res.hash.files).to.eql('1234');
    });
  });
});
