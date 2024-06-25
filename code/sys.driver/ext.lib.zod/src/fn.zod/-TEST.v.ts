import { describe, it, expect, type t, z } from '../test';

describe('Zod', () => {
  /**
   * https://zod.dev/?id=basic-usage
   */
  it('Basic Usage', () => {
    const mySchema = z.string();

    // Parse.
    expect(mySchema.parse('tuna')).to.eql('tuna');

    // Fail.
    const fn = () => mySchema.parse(123);
    expect(fn).to.throw(/Expected string, received number/);
  });
});
