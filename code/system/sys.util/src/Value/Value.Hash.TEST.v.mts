import { Value } from '.';
import { describe, expect, it } from '../test';

describe('Value.Hash', () => {
  describe('shortenHash', () => {
    const hash = 'sha256-1234567890';
    const uri = 'sha1:1234567890';

    it('(default)', () => {
      const res = Value.shortenHash(`   ${hash}   `, 3);
      expect(res).to.eql('sha..890');
    });

    it('empty string', () => {
      expect(Value.shortenHash('', 3)).to.eql('');
      expect(Value.shortenHash('  ', 3)).to.eql('');
    });

    it('length: number', () => {
      const res = Value.shortenHash(hash, 6);
      expect(res).to.eql('sha256..567890');
    });

    it('length: [number, number]', () => {
      const res = Value.shortenHash(hash, [3, 5], { trimPrefix: true });
      expect(res).to.eql('123..67890');
    });

    it('length: [0, 5]', () => {
      const res = Value.shortenHash(hash, [0, 5], { trimPrefix: true });
      expect(res).to.eql('67890');
    });

    it('length: [5, 0]', () => {
      const res = Value.shortenHash(hash, [5, 0], { trimPrefix: true });
      expect(res).to.eql('12345');
    });

    it('custom divider', () => {
      const res = Value.shortenHash(hash, 3, { trimPrefix: true, divider: '-' });
      expect(res).to.eql('123-890');
    });

    describe('trim prefix', () => {
      it('true', () => {
        const test = (hash: string) => {
          const res = Value.shortenHash(hash, 3, { trimPrefix: true });
          expect(res).to.eql('123..890');
        };
        test('sha256-1234567890');
        test('SHA1-1234567890');
        test('sha512-1234567890');
        test('md5-1234567890');
        test('md5:1234567890');
      });

      it('string divider', () => {
        const res1 = Value.shortenHash(hash, 3, { trimPrefix: '-' });
        const res2 = Value.shortenHash(hash, 3, { trimPrefix: true });
        const res3 = Value.shortenHash(uri, 3, { trimPrefix: ['-', ':'] });
        const res4 = Value.shortenHash(hash, 3, { trimPrefix: false });
        expect(res1).to.eql('123..890');
        expect(res2).to.eql('123..890');
        expect(res3).to.eql('123..890');
        expect(res4).to.eql('sha..890');
      });
    });
  });
});
