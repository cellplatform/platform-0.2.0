import { PeerId, PeerUri } from '.';
import { Webrtc, describe, expect, it, slug } from '../test';
import { Is } from './Is';

describe('Is', () => {
  it('exports', () => {
    expect(Webrtc.Is).to.equal(Is);
    expect(Webrtc.PeerJs.Is).to.equal(Is);
    expect(PeerUri.Is).to.equal(Is);
  });

  describe('Is.peerid', () => {
    it('true', () => {
      const test = (input: any) => expect(Is.peerid(input)).to.eql(true);
      test(PeerId.generate());
      test(` ${PeerId.generate()}  `);
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

  describe('Is.<kind>', () => {
    const NOT = [null, undefined, 123, {}, [], true, '', ' ', 'foo'];

    it('Is.kindData', () => {
      const test = (input: any, expected: boolean) => expect(Is.kindData(input)).to.eql(expected);
      NOT.forEach((v) => test(v, false));
      test(' data ', false);
      test('data', true);
    });

    it('Is.kindMedia', () => {
      const test = (input: any, expected: boolean) => expect(Is.kindMedia(input)).to.eql(expected);
      NOT.forEach((v) => test(v, false));
      test(' media:video ', false);
      test(' media:screen ', false);
      test('media:video', true);
      test('media:screen', true);
    });
  });
});
