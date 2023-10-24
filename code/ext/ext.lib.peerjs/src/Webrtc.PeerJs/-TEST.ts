import { DEFAULTS, expect, Id, Test, Webrtc, type t } from '../test.ui';
import { PeerId } from '../Webrtc';

export default Test.describe('Webrtc.PeerJs', (e) => {
  e.describe('options', (e) => {
    e.it('Peer.options (with args)', (e) => {
      const res1 = Webrtc.PeerJs.options(DEFAULTS.signal);
      const res2 = Webrtc.PeerJs.options();
      expect(res1.port).to.eql(443);
      expect(res1.secure).to.eql(true);
      expect(res1.host).to.eql(DEFAULTS.signal.host);
      expect(res1.path).to.eql('/' + DEFAULTS.signal.path + '/');
      expect(res1.key).to.eql(DEFAULTS.signal.key);
      expect(res1).to.eql(res2);
    });

    e.it('Peer.options (partial args)', (e) => {
      const res = Webrtc.PeerJs.options({ host: 'https://foo.com/' });
      expect(res.host).to.eql('foo.com');

      expect(res.port).to.eql(443);
      expect(res.secure).to.eql(true);
      expect(res.path).to.eql('/' + DEFAULTS.signal.path + '/');
      expect(res.key).to.eql(DEFAULTS.signal.key);
    });

    e.it('Peer.options (no param → defaults)', (e) => {
      const res1 = Webrtc.PeerJs.options();
      const res2 = Webrtc.PeerJs.options(DEFAULTS.signal);
      expect(res1).to.eql(res2);
    });
  });

  e.describe('create', (e) => {
    const assertOptions = (peer: t.PeerJs, expectOptions: t.PeerJsOptions) => {
      Object.entries(expectOptions).forEach(([key, value]) => {
        expect((peer.options as any)[key]).to.eql(value, `${key}`);
      });
    };

    e.it('Peer.create( ) ← default options', (e) => {
      const peer1 = Webrtc.PeerJs.create();
      const peer2 = Webrtc.PeerJs.create();
      expect(peer1.id).to.not.eql(peer2.id);

      assertOptions(peer1, Webrtc.PeerJs.options());
      assertOptions(peer2, Webrtc.PeerJs.options());

      expect(PeerId.is(peer1.id)).to.eql(true);
      expect(PeerId.is(peer2.id)).to.eql(true);
    });

    e.it('Peer.create({ options }) ← explicit options', (e) => {
      const peer1 = Webrtc.PeerJs.create({});
      const peer2 = Webrtc.PeerJs.create({ host: 'https://foo.com', path: '//bar', key: 'yo' });

      expect(PeerId.is(peer1.id)).to.eql(true);
      expect(PeerId.is(peer2.id)).to.eql(true);

      expect(peer1.options.host).to.eql('rtc.bus.events');
      expect(peer1.options.path).to.eql('/signal/');
      expect(peer1.options.key).to.eql('cell');

      expect(peer2.options.host).to.eql('foo.com');
      expect(peer2.options.path).to.eql('/bar/');
      expect(peer2.options.key).to.eql('yo');
    });

    e.it('Peer.create(peerid, { options }) ← explicit id and options', (e) => {
      const id1 = Id.slug();
      const id2 = Id.cuid();
      const options = Webrtc.PeerJs.options();

      const peer1 = Webrtc.PeerJs.create(id1, DEFAULTS.signal);
      const peer2 = Webrtc.PeerJs.create(id2);
      const peer3 = Webrtc.PeerJs.create(' ');

      expect(peer1.id).to.eql(id1);
      expect(peer2.id).to.eql(id2);
      expect(Webrtc.Is.peerid(peer3.id)).to.eql(true);

      expect(peer1.options.host).to.eql(options.host);
      expect(peer2.options.host).to.eql(options.host);
    });
  });
});
