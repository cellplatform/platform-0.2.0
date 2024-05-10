import { describe, it, expect } from '../test';
import { Image } from '.';

describe('Image', () => {
  it('isImagePath: true', () => {
    expect(Image.isImagePath('foo/bird.png')).to.eql(true);
    expect(Image.isImagePath('cat.jpg')).to.eql(true);
  });

  it('isImagePath: false', () => {
    expect(Image.isImagePath('')).to.eql(false);
    expect(Image.isImagePath('foo.js')).to.eql(false);
  });
});
