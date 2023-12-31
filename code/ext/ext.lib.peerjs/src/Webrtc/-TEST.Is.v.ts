import { PeerId, PeerUri } from '.';
import { Webrtc, describe, expect, it, slug } from '../test';
import { WebrtcIs } from './Is';

describe('Webrtc.Is', () => {
  it('exports', () => {
    expect(Webrtc.Is).to.equal(WebrtcIs);
    expect(Webrtc.PeerJs.Is).to.equal(WebrtcIs);
    expect(PeerUri.Is).to.equal(WebrtcIs);
  });

  describe('Is.peerid', () => {
    it('true', () => {
      const test = (input: any) => expect(WebrtcIs.peerid(input)).to.eql(true);
      test(PeerId.generate());
      test(` ${PeerId.generate()}  `);
      test(PeerUri.generate(false));
      test(PeerUri.generate('  '));
    });

    it('false', () => {
      const test = (input: any) => expect(WebrtcIs.peerid(input)).to.eql(false);
      ['', ' ', 'foo', 'peer:', 'peer:foo', slug()].forEach(test);
      [null, undefined, 123, {}, [], true, false].forEach(test);
      test(PeerUri.generate(true)); // NB: prefix will disqualify.
    });
  });

  describe('Peer.uri', () => {
    it('true', () => {
      const test = (input: any) => expect(WebrtcIs.uri(input)).to.eql(true);
      test(PeerUri.generate(true));
      test(PeerUri.generate());
      test(`  ${PeerUri.generate()}  `);
    });

    it('false', () => {
      const test = (input: any) => expect(WebrtcIs.uri(input)).to.eql(false);
      ['', ' ', 'foo', 'peer:', 'peer:foo', slug()].forEach(test);
      [null, undefined, 123, {}, [], true, false].forEach(test);
      test(PeerUri.generate(false)); // NB: id only
    });
  });

  describe('Is.<kind>', () => {
    const NOT = [null, undefined, 123, {}, [], true, '', ' ', 'foo'];

    it('Is.kind.data', () => {
      const test = (input: any, expected: boolean) =>
        expect(WebrtcIs.kind.data(input)).to.eql(expected);
      NOT.forEach((v) => test(v, false));
      test(' data ', false);
      test('data', true);
    });

    it('Is.kind.media', () => {
      const test = (input: any, expected: boolean) =>
        expect(WebrtcIs.kind.media(input)).to.eql(expected);
      NOT.forEach((v) => test(v, false));
      test(' media:video ', false);
      test(' media:screen ', false);
      test('media:video', true);
      test('media:screen', true);
    });
  });
});
