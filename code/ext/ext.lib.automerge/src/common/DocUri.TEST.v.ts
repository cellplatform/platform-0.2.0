import { describe, expect, it, type t } from '../test';
import { DocUri } from '.';

type D = { count?: t.A.Counter };

describe('Store.DocUri', () => {
  describe('DocUri.id', () => {
    it('nothing', () => {
      [true, 123, '', [], {}, null, undefined].forEach((value) => {
        expect(DocUri.id(value)).to.eql('');
      });
    });

    it('strips prefix', () => {
      expect(DocUri.id('automerge:abc')).to.eql('abc');
      expect(DocUri.id('  automerge:abc  ')).to.eql('abc');
      expect(DocUri.id('foo:abc')).to.eql('abc');
    });

    it('no prefix', () => {
      expect(DocUri.id('abc')).to.eql('abc');
      expect(DocUri.id('  abc  ')).to.eql('abc');
    });

    it('discard descendent URI parts', () => {
      expect(DocUri.id('automerge:abc:foo')).to.eql('abc');
      expect(DocUri.id('  automerge:abc:foo  ')).to.eql('abc');
    });
  });
});
