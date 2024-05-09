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
      expect(debugColor()).to.eql('rgba(255, 0, 0, 0.3)');
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

  describe('Color.alpha', () => {
    it('DARK', () => {
      const res = Color.alpha(Color.DARK, 0.3);
      expect(res).to.eql('rgba(41, 48, 66, 0.3)');
    });

    it('WHITE', () => {
      const res1 = Color.alpha(Color.WHITE, 0.5);
      const res2 = Color.alpha('white', 0.5);
      const res3 = Color.alpha('#fff', 0.5);
      expect(res1).to.eql('rgba(255, 255, 255, 0.5)');
      expect(res2).to.eql('rgba(255, 255, 255, 0.5)');
      expect(res3).to.eql('rgba(255, 255, 255, 0.5)');
    });
  });

  describe('Color.theme', () => {
    it('name: Light (default)', () => {
      const res1 = Color.theme();
      const res2 = Color.theme('Light');
      const res3 = Color.theme('Light', 'red');
      expect(res1.name).to.eql('Light');
      expect(res1.is.light).to.eql(true);
      expect(res1.is.dark).to.eql(false);
      expect(res1.color).to.eql(Color.DARK);
      expect(res2.color).to.eql(Color.DARK);
      expect(res3.color).to.eql('red');
    });

    it('name: Dark', () => {
      const res1 = Color.theme('Dark');
      const res2 = Color.theme('Dark', null, 'red');
      expect(res1.name).to.eql('Dark');
      expect(res1.is.light).to.eql(false);
      expect(res1.is.dark).to.eql(true);
      expect(res1.color).to.eql(Color.WHITE);
      expect(res2.color).to.eql('red');
    });

    it('alpha', () => {
      const light = Color.theme();
      const dark = Color.theme('Dark');

      const res1 = light.alpha();
      const res2 = light.alpha(0.5);
      const res3 = dark.alpha(0.3);

      expect(res1).to.eql('rgb(41, 48, 66)');
      expect(res2).to.eql('rgba(41, 48, 66, 0.5)');
      expect(res3).to.eql('rgba(255, 255, 255, 0.3)');
    });
  });
});
