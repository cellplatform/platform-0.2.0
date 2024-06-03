import { expect, describe, it, afterEach } from '../test';
import { MEDIA_QUERY_RETINA, image } from '../style.Css';
import { Style } from '..';

const browserWindow: any = global;

describe('Image', () => {
  describe('image()', () => {
    afterEach(() => {
      delete browserWindow.devicePixelRatio;
    });

    it('is attached to the [style] as a property', () => {
      expect(Style.image).to.eql(image);
    });

    it('throws if an image was not specified', () => {
      expect(() => image(undefined, undefined)).to.throw();
    });

    it('returns the 1x resolution', () => {
      browserWindow.devicePixelRatio = 1;
      const res = image('1x', '2x');
      expect(res.backgroundImage).to.eql('url(1x)');
    });

    it('returns the 2x resolution', () => {
      browserWindow.devicePixelRatio = 2;
      const res = image('1x.png', '2x.png');
      expect(res.backgroundImage).to.eql('url(1x.png)');
      expect((res as any)[MEDIA_QUERY_RETINA].backgroundImage).to.eql('url(2x.png)');
    });

    it('returns the 1x resolution on hi-res screen when no 2x image (undefined)', () => {
      browserWindow.devicePixelRatio = 2;
      expect(image('1x', undefined, { width: 10, height: 20 }).backgroundImage).to.eql('url(1x)');
    });

    it('has width and height values (defaults)', () => {
      const res = image('1x', '2x');
      expect(res.width).to.eql(10);
      expect(res.height).to.eql(10);
    });

    it('has width and height values (specified)', () => {
      const res = image('1x', '2x', { width: 20, height: 150 });
      expect(res.width).to.eql(20);
      expect(res.height).to.eql(150);
    });

    it('has [backgroundSize]', () => {
      const res = image('1x', '2x', { width: 20, height: 150 });
      expect(res.backgroundSize).to.eql('20px 150px');
    });

    it('does not repeat the background', () => {
      const result = image('1x', '2x', { width: 20, height: 150 });
      expect(result.backgroundRepeat).to.eql('no-repeat');
    });
  });

  describe('Image replacement via css() method', () => {
    it('replaces `Image` with style settings (1x)', () => {
      browserWindow.devicePixelRatio = 1;
      const res = Style.transform({ Image: ['1x', '2x', 20, 30] }) as any;
      expect(res.Image).to.eql(undefined);
      expect(res.backgroundImage).to.eql('url(1x)');
      expect(res.width).to.eql(20);
      expect(res.height).to.eql(30);
      expect(res.backgroundSize).to.eql('20px 30px');
      expect(res.backgroundRepeat).to.eql('no-repeat');
    });

    it('replaces `Image` with style settings (2x)', () => {
      browserWindow.devicePixelRatio = 2;
      const res = Style.transform({
        Image: ['1x.JPG', '2x.JPG', 20, 30],
      }) as any;
      expect(res.Image).to.eql(undefined);
      expect(res.backgroundImage).to.eql('url(1x.JPG)');
      expect(res[MEDIA_QUERY_RETINA].backgroundImage).to.eql('url(2x.JPG)');
    });
  });
});
