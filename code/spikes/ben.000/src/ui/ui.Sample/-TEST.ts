import { Test, expect, type t } from '../../test.ui';
import { Bitext } from './Bitext';

const { TranslationUnit } = Bitext;

export default Test.describe('Bitext', (e) => {
  e.describe('create a translation unit', (e) => {
    e.it('default with empty strings', (e) => {
      const pair = Bitext.TranslationUnit.create();
      expect(pair.source).to.eql('');
      expect(pair.target).to.eql('');
    });

    e.it('initial values with defaults', (e) => {
      const source = '情報革命\n';
      const target = 'information revolution';
      const pair1 = Bitext.TranslationUnit.create({ source });
      const pair2 = Bitext.TranslationUnit.create({ target });
      const pair3 = Bitext.TranslationUnit.create({ source, target });

      expect(pair1.source).to.eql(source);
      expect(pair1.target).to.eql('');

      expect(pair2.source).to.eql('');
      expect(pair2.target).to.eql(target);

      expect(pair3.source).to.eql(source);
      expect(pair3.target).to.eql(target);
    });
  });

  e.describe('cleaning', (e) => {
    e.it('cleans source without spaces', () => {
      const source = `
        情報革命↩︎
        情報革命↲
        情報革命↵
      `;
      const original = TranslationUnit.create({ source });
      expect(original.source).to.eql(source);

      const cleaned = TranslationUnit.clean(original);
      expect(cleaned).to.not.equal(original);
      expect(original.source).to.eql(source);
      expect(cleaned.source).to.not.eql(source);
      TranslationUnit.linebreakCharacters.forEach((char) => {
        expect(cleaned.source.includes(char)).to.eql(false);
      });
      expect(cleaned.source.includes(' ')).to.eql(false);
    });

    e.it.skip('cleans target with spaces', async (e) => {});
  });
});
