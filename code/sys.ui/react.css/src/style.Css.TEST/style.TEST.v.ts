import { expect, describe, it } from '../test';
import { Style } from '..';

describe('Style', () => {
  describe('format', () => {
    it('is a function', () => {
      expect(Style.format).to.be.an.instanceof(Function);
    });
  });

  describe('transform', () => {
    it('is a function', () => {
      expect(Style.transform).to.be.an.instanceof(Function);
    });

    it('returns the given object', () => {
      const input = { color: 'red' };
      expect(Style.transform(input)).to.equal(input);
    });

    it('returns an empty object if no `style` parameter is given', () => {
      expect(Style.transform()).to.eql({});
    });

    it('removes undefined values', () => {
      const input = { color: undefined, background: undefined };
      expect(Style.transform(input)).to.eql({});
    });
  });

  describe('head', () => {
    it('head', () => {
      expect(Style.head.importStylesheet).to.be.an.instanceof(Function);
    });
  });

  describe('global', () => {
    it('global: psudo-elements', () => {
      Style.global({
        div: {
          color: 'red',
          ':first-child': { color: 'blue' },
          ':last-child': { color: 'green' },
          ':focus': { color: 'green' },
          ':hover': { color: 'green' },
          ':visited': { color: 'green' },
        },
      });
    });
  });
});
