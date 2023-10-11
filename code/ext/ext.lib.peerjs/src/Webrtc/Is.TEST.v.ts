import { Webrtc, cuid, describe, expect, it, slug } from '../test';
import { Is } from './Is';
import { PeerUri } from './Peer.Uri';

describe('PeerIs', () => {
  it('exports', () => {
    expect(PeerUri.Is).to.equal(Is);
    expect(Webrtc.Is).to.equal(Is);
  });

  describe('is', () => {
    it('is.peerid ← true', () => {
      const test = (input: any) => {
        expect(Is.peerid(input)).to.eql(true);
      };
      test(cuid());
      test(PeerUri.generate(false));
      test(PeerUri.generate('  '));
    });

    it('is.peerid ← false', () => {
      const strings = ['', ' ', 'foo', 'peer:', 'peer:foo', slug(), PeerUri.generate(true)];
      [null, undefined, 123, {}, [], true, ...strings].forEach((value) => {
        expect(Is.peerid(value)).to.eql(false, String(value));
      });
    });
  });
});
