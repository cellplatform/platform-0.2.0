import { expect } from '../TEST/index.mjs';
import { Value } from './index.mjs';

describe('round', () => {
  it('rounds to 0 decimal places', () => {
    expect(Value.round(1.123)).to.equal(1);
    expect(Value.round(1.513)).to.equal(2);
  });

  it('rounds to 1 decimal place', () => {
    expect(Value.round(1.123, 1)).to.equal(1.1);
    expect(Value.round(1.153, 1)).to.equal(1.2);
  });

  it('rounds to 2 decimal places', () => {
    expect(Value.round(1.123, 2)).to.equal(1.12);
    expect(Value.round(1.156, 2)).to.equal(1.16);
  });

  it('rounds to 3 decimal places', () => {
    expect(Value.round(1.123, 3)).to.equal(1.123);
    expect(Value.round(1.156, 3)).to.equal(1.156);
  });
});

describe('random', () => {
  it('is random within bounds (5..10)', () => {
    const res = Value.random(5, 10);
    expect(res).to.greaterThan(4);
    expect(res).to.lessThan(11);
  });
});
