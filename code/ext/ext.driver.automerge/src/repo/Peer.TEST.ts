import { expect, Test, type t } from '../test.ui';
import { Peer } from '.';

export default Test.describe('Peer', (e) => {
  e.describe('Peer.id', (e) => {
    e.it('.prefix', (e) => {
      expect(Peer.id.prefix('SharedWorker')).to.eql('shared-worker');
      const fn = () => Peer.id.prefix('foobar' as any);
      expect(fn).to.throw(/'foobar' not supported/);
    });

    e.it('.is', (e) => {
      const test = (kind: t.PeerIdKind, id: any, expected: boolean) => {
        const res = Peer.id.is(kind, id);
        expect(res).to.eql(expected, id);
      };
      test('SharedWorker', 'shared-worker', true);
      test('SharedWorker', 'shared-worker.', true);
      test('SharedWorker', 'shared-worker-abc', true);

      test('StorageServer', 'storage-server', true);
      test('StorageServer', 'storage-server-', true);
      test('StorageServer', 'storage-server-abc', true);

      [null, true, [], {}, '', 'foobar', 123].forEach((value) => {
        test('SharedWorker', value, false);
        test('StorageServer', value, false);
      });
    });

    e.describe('.generate', (e) => {
      e.it('SharedWorker: random suffix', (e) => {
        const id1 = Peer.id.generate('SharedWorker');
        const id2 = Peer.id.generate('SharedWorker');
        expect(id1).to.not.eql(id2);
      });

      e.it('StorageServer: no suffix', (e) => {
        const id = Peer.id.generate('StorageServer', '');
        expect(id).to.eql('storage-server');
      });

      e.it('StorageServer: explicit suffix', (e) => {
        const id = Peer.id.generate('StorageServer', 'myhost');
        expect(id).to.eql('storage-server-myhost');
      });

      e.it('StorageServer: random suffix', (e) => {
        const id = Peer.id.generate('StorageServer');
        expect(id.startsWith('storage-server-')).to.eql(true);
      });
    });
  });
});
