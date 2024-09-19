import { describe, expect, it } from './common/mod.ts';
import { env } from './env.ts';

describe('DenoCloud (client)', () => {
  it('.env contains values', () => {
    const expectValue = <T>(obj: T, ns: string, key: keyof T) => {
      const value = obj[key];
      expect(value).to.be.string;
      const text = String(value);
      console.log(' > ', key, '*'.repeat(text.length));
      expect(text.length).to.be.greaterThan(5, `missing secret value for {${ns}.${String(key)}}`);
    };

    expectValue(env.privy, 'privy', 'appId');
    expectValue(env.privy, 'privy', 'appSecret');

    expectValue(env.deno, 'deno', 'accessToken');
    expectValue(env.deno, 'deno', 'orgId');
  });
});
