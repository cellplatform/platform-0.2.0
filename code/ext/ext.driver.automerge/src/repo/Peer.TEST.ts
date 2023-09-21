import { expect, Test } from '../test.ui';
import { Peer } from '.';

export default Test.describe('Peer', (e) => {
  e.it('Peer.prefix', (e) => {
    expect(Peer.prefix('SharedWorker')).to.eql('crdt:shared-worker.');
    const fn = () => Peer.prefix('foobar' as any);
    expect(fn).to.throw(/'foobar' not supported/);
  });

  e.it('Peer.id (random)', (e) => {
    const id1 = Peer.id('SharedWorker');
    const id2 = Peer.id('SharedWorker');
    expect(id1).to.not.eql(id2);
  });

  e.it('Peer.is', (e) => {
    expect(Peer.is('SharedWorker', 'crdt:shared-worker.')).to.eql(true);
    expect(Peer.is('SharedWorker', 'foo')).to.eql(false);
    expect(Peer.is('SharedWorker', 'shared-worker')).to.eql(false);
    [null, true, [], {}, '', 123].forEach((value) => {
      expect(Peer.is('SharedWorker', value)).to.eql(false);
    });
  });
});
