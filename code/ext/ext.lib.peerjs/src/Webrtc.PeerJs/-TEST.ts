import { DEFAULTS, Id, Test, Webrtc, expect, type t } from '../test.ui';

export default Test.describe('Webrtc.PeerJs', (e) => {
  e.describe('options', (e) => {
    e.it('Peer.options (with args)', (e) => {
      const res = Webrtc.PeerJs.options(DEFAULTS.signal);
      expect(res.port).to.eql(443);
      expect(res.secure).to.eql(true);
      expect(res.host).to.eql(DEFAULTS.signal.host);
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

      expect(Id.is.cuid(peer1.id)).to.eql(true);
      expect(Id.is.cuid(peer2.id)).to.eql(true);
    });

    e.it('Peer.create({ options }) ← explicit options', (e) => {
      const options = DEFAULTS.signal as any;
      delete options.host; // Test hack.
      const peer = Webrtc.PeerJs.create(options);

      expect(Id.is.cuid(peer.id)).to.eql(true);
      expect(peer.options.host?.includes('peerjs.com')).to.be.true;
    });

    e.it('Peer.create(peerid, { options }) ← explicit id and options', (e) => {
      const id1 = Id.slug();
      const id2 = Id.cuid();
      const options = Webrtc.PeerJs.options();

      const peer1 = Webrtc.PeerJs.create(id1, DEFAULTS.signal);
      const peer2 = Webrtc.PeerJs.create(id2);

      expect(peer1.id).to.eql(id1);
      expect(peer2.id).to.eql(id2);

      expect(peer1.options.host).to.eql(options.host);
      expect(peer2.options.host).to.eql(options.host);
    });
  });
});
