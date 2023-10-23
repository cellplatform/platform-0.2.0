import { Webrtc, cuid, describe, expect, it, slug } from '../test';
import { Is } from './Is';
import { PeerUri } from './Peer.Uri';

describe('Is', () => {
  it('exports', () => {
    expect(Webrtc.Is).to.equal(Is);
    expect(Webrtc.PeerJs.Is).to.equal(Is);
    expect(PeerUri.Is).to.equal(Is);
  });

  describe('Is.peerid', () => {
    it('true', () => {
      const test = (input: any) => expect(Is.peerid(input)).to.eql(true);
      test(cuid());
      test(` ${cuid()}  `);
      test(PeerUri.generate(false));
      test(PeerUri.generate('  '));
    });

    it('false', () => {
      const test = (input: any) => expect(Is.peerid(input)).to.eql(false);
      ['', ' ', 'foo', 'peer:', 'peer:foo', slug()].forEach(test);
      [null, undefined, 123, {}, [], true, false].forEach(test);
      test(PeerUri.generate(true)); // NB: prefix will disqualify.
    });
  });

  describe('Peer.uri', () => {
    it('true', () => {
      const test = (input: any) => expect(Is.uri(input)).to.eql(true);
      test(PeerUri.generate(true));
      test(PeerUri.generate());
      test(`  ${PeerUri.generate()}  `);
    });

    it('false', () => {
      const test = (input: any) => expect(Is.uri(input)).to.eql(false);
      ['', ' ', 'foo', 'peer:', 'peer:foo', slug()].forEach(test);
      [null, undefined, 123, {}, [], true, false].forEach(test);
      test(PeerUri.generate(false)); // NB: id only
    });
  });
});
