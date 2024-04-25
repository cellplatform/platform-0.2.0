import { DocUri } from '.';
import { describe, expect, it } from '../test';
import { Is } from './u';

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

    it('shorten', () => {
      const uri = 'automerge:3xFTnhG6Z3fzdxqiEoLMRrWHFdfe';
      const res1 = DocUri.id(uri, { shorten: 4 });
      const res2 = DocUri.id(uri, { shorten: [2, 3] });
      expect(res1).to.eql('3xFT..Fdfe');
      expect(res2).to.eql('3x..dfe');
    });
  });

  describe('DocUri.automerge', () => {
    it('nothing', () => {
      [true, 123, '', [], {}, null, undefined].forEach((value) => {
        expect(DocUri.automerge(value)).to.eql('');
      });
    });

    it('ensure "automerge:" prefix', () => {
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

    it('shorten', () => {
      const uri = 'automerge:3xFTnhG6Z3fzdxqiEoLMRrWHFdfe';
      const res1 = DocUri.automerge(uri, { shorten: 4 });
      const res2 = DocUri.automerge(uri, { shorten: [2, 3] });
      expect(res1).to.eql('automerge:3xFT..Fdfe');
      expect(res2).to.eql('automerge:3x..dfe');
    });
  });

  describe('DocUri.generate', () => {
    it('generate.docid.binary', () => {
      const res1 = DocUri.generate.docid.binary();
      const res2 = DocUri.generate.docid.binary();
      expect(res1).to.not.eql(res2); // NB: random on each call.
      expect(res1 instanceof Uint8Array).to.be.true;
    });

    it('generate.docid.string', () => {
      const res = DocUri.generate.docid.string();
      expect(res).to.be.string;
    });

    it('generate.uri: random/unique', () => {
      const res1 = DocUri.generate.uri();
      const res2 = DocUri.generate.uri();
      expect(res1).to.not.eql(res2); // NB: random on each call.
    });

    it('generate.uri: is an automerge URL', () => {
      const uri = DocUri.generate.uri();
      expect(Is.automergeUrl(uri)).to.eql(true);
    });
  });
});
