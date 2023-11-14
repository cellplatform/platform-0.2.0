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

  describe('DocUri.automerge', () => {
    it('nothing', () => {
      [true, 123, '', [], {}, null, undefined].forEach((value) => {
        expect(DocUri.automerge(value)).to.eql('');
      });
    });

    it('ensure "automerge:" prfix', () => {
      const test = (input: any, expected: string) => {
        const res = DocUri.automerge(input);
        expect(res).to.eql(expected, input);
      };
      test('foo', 'automerge:foo');
      test(' foo ', 'automerge:foo');
      test(' db:foo ', 'automerge:foo');
      test(' automerge:foo ', 'automerge:foo');
      test(' automerge ', 'automerge:automerge');
    });
  });
});
