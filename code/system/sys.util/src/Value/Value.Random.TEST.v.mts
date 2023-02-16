import { expect, describe, it } from '../test';
import { Value } from '.';

describe('random', () => {
  it('bounds: (5..)', () => {
    Array.from({ length: 100 }).forEach(() => {
      const res = Value.random(500);
      expect(res).to.greaterThanOrEqual(500);
    });
  });

  it('bounds: (5..10)', () => {
    Array.from({ length: 100 }).forEach(() => {
      const res = Value.random(5, 10);
      expect(res).to.greaterThanOrEqual(5);
      expect(res).to.lessThanOrEqual(10);
    });
  });
});
