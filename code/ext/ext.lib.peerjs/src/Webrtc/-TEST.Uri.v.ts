import { PeerId, PeerUri } from '.';
import { Webrtc, cuid, describe, expect, it } from '../test';

describe('PeerUri', () => {
  it('exports', () => {
    expect(Webrtc.PeerUri).to.equal(PeerUri);
    expect(Webrtc.PeerJs.Uri).to.equal(PeerUri);
  });

  describe('generate', () => {
    it('default', () => {
      const res1 = PeerUri.generate();
      const res2 = PeerUri.generate(false);
      expect(res1.startsWith('peer:')).to.eql(true);
      expect(PeerId.is(res1.split(':')[1])).to.eql(true);
      expect(PeerId.is(res2)).to.eql(true);
    });

    it('prefix: true → "peer:"', () => {
      const res = PeerUri.generate(true);
      expect(res.startsWith('peer:')).to.eql(true);
      expect(PeerId.is(res.split(':')[1])).to.eql(true);
    });

    it('prefix: string → empty ("")', () => {
      const test = (uri: string) => {
        expect(PeerId.is(uri)).to.eql(true);
      };
      test(PeerUri.generate(''));
      test(PeerUri.generate('  '));
    });

    it('prefix: string → "foo:"', () => {
      const test = (uri: string, prefix: string) => {
        expect(uri.startsWith(`${prefix}:`)).to.eql(true);
        expect(PeerId.is(uri.split(':')[1])).to.eql(true);
      };
      test(PeerUri.generate('  foo  '), 'foo');
      test(PeerUri.generate('foo'), 'foo');
      test(PeerUri.generate('foo:'), 'foo');
      test(PeerUri.generate('foo::'), 'foo');
      test(PeerUri.generate(' ::foo:: '), 'foo');
    });
  });

  describe('id', () => {
    it('empty', () => {
      expect(PeerUri.id()).to.eql('');
      expect(PeerUri.id('')).to.eql('');
      expect(PeerUri.id('   ')).to.eql('');
    });

    it('no prefix → simple trim', () => {
      const id = cuid();
      expect(PeerUri.id(id)).to.eql(id);
      expect(PeerUri.id('foo')).to.eql('foo');
      expect(PeerUri.id('  foo  ')).to.eql('foo');
    });

    it('removes URI prefix', () => {
      expect(PeerUri.id('peer:foo')).to.eql('foo');
      expect(PeerUri.id(' peer:foo ')).to.eql('foo');
      expect(PeerUri.id('me:foo')).to.eql('foo');
      expect(PeerUri.id('me:self:foo')).to.eql('foo');
      expect(PeerUri.id('me:self: foo ')).to.eql('foo');
    });

    it('non-string → empty ("")', () => {
      [123, true, {}, [], undefined, null].forEach((input) => {
        expect(PeerUri.id(input as any)).to.eql('');
      });
    });
  });

  describe('uri', () => {
    it('empty', () => {
      expect(PeerUri.uri()).to.eql('');
      expect(PeerUri.uri('')).to.eql('');
      expect(PeerUri.uri('   ')).to.eql('');
    });

    it('uri', () => {
      expect(PeerUri.uri('foo')).to.eql('peer:foo');
      expect(PeerUri.uri(' foo  ')).to.eql('peer:foo');
      expect(PeerUri.uri('peer:foo')).to.eql('peer:foo');
      expect(PeerUri.uri(' peer:foo ')).to.eql('peer:foo');
      expect(PeerUri.uri(' peer: foo ')).to.eql('peer:foo');
      expect(PeerUri.uri(' peer:local: self:foo')).to.eql('peer:foo');
    });

    it('non-string → empty ("")', () => {
      [123, true, {}, [], undefined, null].forEach((input) => {
        expect(PeerUri.id(input as any)).to.eql('');
      });
    });
  });

  describe('prepend', () => {
    it('prepend (default)', () => {
      expect(PeerUri.prepend('foo')).to.eql('peer:foo');
      expect(PeerUri.prepend(' foo ')).to.eql('peer:foo');
    });

    it('prepend (given prefix)', () => {
      expect(PeerUri.prepend('foo', 'me')).to.eql('me:foo');
      expect(PeerUri.prepend('  foo  ', '  me  ')).to.eql('me:foo');
      expect(PeerUri.prepend(' foo', 'me ', ' local')).to.eql('me:local:foo');
    });

    it('prepend existing URI', () => {
      expect(PeerUri.prepend('peer:foo', 'me')).to.eql('me:peer:foo');
      expect(PeerUri.prepend(' peer : foo ', 'me')).to.eql('me:peer:foo');
    });
  });
});
