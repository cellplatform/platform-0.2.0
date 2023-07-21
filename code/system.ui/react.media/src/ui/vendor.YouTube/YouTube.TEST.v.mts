import { describe, expect, it } from '../../test';
import { Wrangle } from './util.mjs';

describe('YouTube', () => {
  describe('Wrangle', () => {
    it('toEmbedUrl', () => {
      const id = 'abc';
      const res1 = Wrangle.toEmbedUrl({ id });
      const res2 = Wrangle.toEmbedUrl({ id, start: 10 });
      expect(res1).to.eql('https://www.youtube.com/embed/abc');
      expect(res2).to.eql('https://www.youtube.com/embed/abc?start=10');
    });
  });

  it('fromUrl', () => {
    const test = (input: string, expectId: string, expectStart?: number) => {
      const res = Wrangle.fromUrl(input);
      expect(res.href).to.eql(input.trim(), input);
      expect(res.id).to.eql(expectId);
      expect(res.start).to.eql(expectStart, input);
    };

    test(' https://www.youtube.com/embed/abc ', 'abc');
    test(' https://youtu.be/URUJD5NEXC8 ', 'URUJD5NEXC8');

    test(' https://www.youtube.com/embed/abc?start=5 ', 'abc', 5);
    test(' https://youtu.be/URUJD5NEXC8?t=40 ', 'URUJD5NEXC8', 40);

    test('https://www.youtube.com/watch?v=abc&t=39s', 'abc', 39);
    test('https://www.youtube.com/watch?v=abc', 'abc');

    test('', '');
    test('https://www.youtube.com/watch?v=', '');
    test('https://www.youtube.com/watch', '');
    test('https://www.youtube.com/embed/', '');
    test('https://youtu.be/', '');
  });
});
