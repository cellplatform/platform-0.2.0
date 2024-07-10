import { SampleMain as Sample } from './Main';
import { render } from './Main.u.render';

/**
 * Development Tools:
 *    Test/Dev harness helpers and
 *    <Sample> user-interface.
 */
export const Dev = {
  Main: { render, Sample },
} as const;
