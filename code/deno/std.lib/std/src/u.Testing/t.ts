import type { t } from '../common.ts';
import type { describe, it } from '@std/testing/bdd';
import type { expect } from 'npm:chai';

/**
 * Testing helpers.
 */
export type Testing = {
  readonly Bdd: TestBdd;
  wait(delay: t.Msecs): Promise<void>;
};

export type TestBdd = {
  readonly expect: typeof expect;
  readonly describe: typeof describe;
  readonly it: typeof it;
};
