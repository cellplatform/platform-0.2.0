import { Id, Webrtc, cuid, describe, expect, it } from '../test';
import { PeerUri } from './PeerUri';

describe('PeerUri', () => {
  it('exports', () => {
    expect(Webrtc.PeerUri).to.equal(PeerUri);
    expect(Webrtc.Peer.Uri).to.equal(PeerUri);
  });

  describe('generate', () => {
    it('default: simple cuid', () => {
      const res = PeerUri.generate();
      expect(Id.is.cuid(res)).to.eql(true);
    });

    it('prefix: true → "peer:"', () => {
      const res = PeerUri.generate(true);
      expect(res.startsWith('peer:')).to.eql(true);
      expect(Id.is.cuid(res.split(':')[1])).to.eql(true);
    });

    it('prefix: string → "foo:"', () => {
      const assert = (uri: string, prefix: string) => {
        expect(res.startsWith(`${prefix}:`)).to.eql(true);
        expect(Id.is.cuid(res.split(':')[1])).to.eql(true);
      };
      const res = PeerUri.generate('  foo  ');
      assert(PeerUri.generate('  foo  '), 'foo');
      assert(PeerUri.generate('foo'), 'foo');
      assert(PeerUri.generate('foo:'), 'foo');
      assert(PeerUri.generate('foo::'), 'foo');
      assert(PeerUri.generate(' ::foo:: '), 'foo');
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
      expect(PeerUri.id('me:local:foo')).to.eql('foo');
      expect(PeerUri.id('me:local: foo ')).to.eql('foo');
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
