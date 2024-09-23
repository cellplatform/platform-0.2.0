import { Async, Time } from '../mod.ts';
import { describe, expect, it } from '../test.ts';

describe('Async', () => {
  it('exposes the Time.delay function', () => {
    expect(Async.delay).to.equal(Time.delay);
  });
});
