import { Webrtc } from '.';
import { DEFAULTS, Id, Test, expect, type t, Time } from '../test.ui';

export default Test.describe('Webrtc.Peer', (e) => {
  e.describe('options', (e) => {
    e.it('Peer.options (with args)', (e) => {
      const res = Webrtc.Peer.options(DEFAULTS.signal);
      expect(res.port).to.eql(443);
      expect(res.secure).to.eql(true);
      expect(res.host).to.eql(DEFAULTS.signal.host);
      expect(res.path).to.eql('/' + DEFAULTS.signal.path + '/');
      expect(res.key).to.eql(DEFAULTS.signal.key);
    });

    e.it('Peer.options (no param → defaults)', (e) => {
      const res1 = Webrtc.Peer.options();
      const res2 = Webrtc.Peer.options(DEFAULTS.signal);
      expect(res1).to.eql(res2);
    });
  });

  e.describe('create', (e) => {
    const assertOptions = (peer: t.Peer, expectOptions: t.PeerOptions) => {
      Object.entries(expectOptions).forEach(([key, value]) => {
        expect((peer.options as any)[key]).to.eql(value, `${key}`);
      });
    };

    e.it('Peer.create( ) ← default options', (e) => {
      const peer1 = Webrtc.Peer.create();
      const peer2 = Webrtc.Peer.create();
      expect(peer1.id).to.not.eql(peer2.id);

      assertOptions(peer1, Webrtc.Peer.options());
      assertOptions(peer2, Webrtc.Peer.options());

      expect(Id.is.cuid(peer1.id)).to.eql(true);
      expect(Id.is.cuid(peer2.id)).to.eql(true);
    });

    e.it('Peer.create({ options }) ← explicit options', (e) => {
      const options = DEFAULTS.signal as any;
      delete options.host; // Test hack.
      const peer = Webrtc.Peer.create(options);

      expect(Id.is.cuid(peer.id)).to.eql(true);
      expect(peer.options.host?.includes('peerjs.com')).to.be.true;
    });

    e.it('Peer.create(peerid, { options }) ← explicit id and options', (e) => {
      const id1 = Id.slug();
      const id2 = Id.cuid();
      const options = Webrtc.Peer.options();

      const peer1 = Webrtc.Peer.create(id1, DEFAULTS.signal);
      const peer2 = Webrtc.Peer.create(id2);

      expect(peer1.id).to.eql(id1);
      expect(peer2.id).to.eql(id2);

      expect(peer1.options.host).to.eql(options.host);
      expect(peer2.options.host).to.eql(options.host);
    });
  });
});