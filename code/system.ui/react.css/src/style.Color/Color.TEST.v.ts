import { Color } from '.';
import { describe, expect, it } from '../test';

describe('color', () => {
  describe('Color.format', () => {
    const test = (value: string | number | boolean | undefined, output: string | undefined) => {
      expect(Color.format(value)).to.eql(output);
    };

    it('converts number to RGBA', () => {
      test(0, 'rgba(0, 0, 0, 0.0)');
      test(1, 'rgba(255, 255, 255, 1)');
      test(0.5, 'rgba(255, 255, 255, 0.5)');
      test(-1, 'rgba(0, 0, 0, 1)');
      test(-0.5, 'rgba(0, 0, 0, 0.5)');
    });

    it('converts TRUE to RED (ruby)', () => {
      test(true, Color.RED);
    });

    it('undefined', () => {
      test(undefined, undefined);
    });

    it('string: RGB value', () => {
      const rgb = 'rgb(0, 245, 35)';
      test(rgb, rgb);
    });

    it('string: RGBA value', () => {
      const rgb = 'rgba(0, 245, 35, 0.7)';
      test(rgb, rgb);
    });

    it('string: hex value', () => {
      const hex = '#fff';
      test(hex, hex);
    });

    it('string: hex value with no hash', () => {
      test('fff', '#fff');
    });

    it('string: does not convert "url(...)"', () => {
      const value = `url(my-image.png)`;
      test(value, value);
    });
  });

  describe('Color.debug', () => {
    it('debugging: true', () => {
      const debugColor = Color.debug(true);
      expect(debugColor(0.3)).to.eql('rgba(255, 0, 0, 0.3)');
    });

    it('not debugging: false', () => {
      const debugColor = Color.debug(false);
      expect(debugColor(0.3)).to.eql(undefined);
    });

    it('not debugging: (undefined)', () => {
      const debugColor = Color.debug();
      expect(debugColor(0.3)).to.eql(undefined);
    });
  });

  describe('Color.fromTheme', () => {
    it('theme: Light (default)', () => {
      const res1 = Color.fromTheme();
      const res2 = Color.fromTheme('Light');
      expect(res1).to.eql(Color.DARK);
      expect(res2).to.eql(Color.DARK);
    });

    it('theme: Dark', () => {
      const res = Color.fromTheme('Dark');
      expect(res).to.eql(Color.WHITE);
    });
  });
});
