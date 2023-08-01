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

  describe('width / height', () => {
    it('width, 16:9, 500', () => {
      const res = AspectRatio.width('16:9', 500);
      expect(res).to.eql(281.25);
    });

    it('height, 16:9, 200', () => {
      const res = AspectRatio.height('16:9', 200);
      expect(res).to.eql(355.55555555555554);
    });

    it('throw: invalid aspect-ratio', () => {
      const test = (ratio: any) => {
        const err = /Invalid aspect ratio/;
        expect(() => AspectRatio.width(ratio, 100)).to.throw(err);
        expect(() => AspectRatio.height(ratio, 100)).to.throw(err);
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
