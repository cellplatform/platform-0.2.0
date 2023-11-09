import { z } from 'zod';
import { expect, Test } from '../test.ui';

/**
 * Library: Zod
 * TypeScript-first schema validation with static type inference
 * https://github.com/colinhacks/zod
 */
export default Test.describe('zod', (e) => {
  /**
   *  https://github.com/colinhacks/zod#basic-usage
   */
  e.describe('zod: basic usage', (e) => {
    e.it.skip('Creating a simple string schema', (e) => {
      // creating a schema for strings
      const mySchema = z.string();

      // parsing
      mySchema.parse('tuna'); // => "tuna"
      mySchema.parse(12); // => throws ZodError

      // "safe" parsing (doesn't throw error if validation fails)
      mySchema.safeParse('tuna'); // => { success: true; data: "tuna" }
      mySchema.safeParse(12); // => { success: false; error: ZodError }
    });

    e.it('Creating an object schema', (e) => {
      const User = z.object({
        username: z.string(),
      });

      const s = User.parse({ username: 'Ludwig' });

      console.log('s', s);

      // extract the inferred type
      type User = z.infer<typeof User>;
      // { username: string }
    });
  });

  /**
   * https://github.com/colinhacks/zod#primitives
   */
  e.describe('zod: primitives', (e) => {
    e.it('values', (e) => {
      // primitive values
      z.string();
      z.number();
      z.bigint();
      z.boolean();
      z.date();
      z.symbol();

      // empty types
      z.undefined();
      z.null();
      z.void(); // accepts undefined

      // catch-all types
      // allows any value
      z.any();
      z.unknown();

      // never type
      // allows no values
      z.never();
    });
  });
});
