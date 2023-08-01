import { AspectRatio } from '.';
import { describe, expect, it } from '../test';

describe('AspectRatio', (e) => {
  describe('fromSize', () => {
    it('500 x 281.25 → 16:9', (e) => {
      const res = AspectRatio.fromSize(500, 281.25);
      expect(res.ratio).to.eql('16:9');
      expect(res.toString()).to.eql('16:9');
      expect(res.x).to.eql(16);
      expect(res.y).to.eql(9);
    });
  });

  describe('fromDimension', () => {
    it('width, 16:9, 500', () => {
      const res1 = AspectRatio.fromDimension('width', '16:9', 500);
      const res2 = AspectRatio.fromWidth('16:9', 500);
      expect(res1).to.eql(281.25);
      expect(res1).to.eql(res2);
    });

    it('height, 16:9, 200', () => {
      const res1 = AspectRatio.fromDimension('height', '16:9', 200);
      const res2 = AspectRatio.fromHeight('16:9', 200);
      expect(res1).to.eql(355.55555555555554);
      expect(res1).to.eql(res2);
    });

    it('throw: invalid aspect-ratio', () => {
      const test = (ratio: any) => {
        const fn = () => AspectRatio.fromDimension('width', ratio, 100);
        expect(fn).to.throw(/Invalid aspect ratio/);
      };
      ['', undefined, null, {}, 123, true].forEach((ratio) => test(ratio));
      test('1');
      test('1:2:3');
      test('a:2');
      test('2:a');
      test('a:a');
    });
  });
});
