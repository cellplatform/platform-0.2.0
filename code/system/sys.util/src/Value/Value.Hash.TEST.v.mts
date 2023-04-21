import { Value } from '.';
import { describe, expect, it } from '../test';

describe('Value.Hash', () => {
  describe('shortenHash', () => {
    const hash = 'sha256-1234567890';

    it('(default)', () => {
      const res = Value.shortenHash(`   ${hash}   `, 3);
      expect(res).to.eql('sha .. 890');
    });

    describe('trim prefix', () => {
      it('true', () => {
        const test = (hash: string) => {
          const res = Value.shortenHash(hash, 3, { trimPrefix: true });
          expect(res).to.eql('123 .. 890');
        };
        test('sha256-1234567890');
        test('SHA1-1234567890');
        test('sha512-1234567890');
        test('md5-1234567890');
      });

      it('string ("SHA256-")', () => {
        const res1 = Value.shortenHash(hash, 3, { trimPrefix: 'SHA256-' });
        const res2 = Value.shortenHash(hash, 3, { trimPrefix: 'sha256-' });
        expect(res1).to.eql('123 .. 890');
        expect(res2).to.eql('123 .. 890');
      });
    });
  });
});
