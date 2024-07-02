import { Immutable, Tests, describe, expect, it, rx, type t } from '../test';

/**
 * Standardised test suite for the <Cmd> system.
 */
describe('Cmd (Command)', () => {
  Tests.all(setup, { describe, it, expect });
});

/**
 * NB: this is the "immutable system" setup that is unique
 *     to each module using a different transport/approach
 *     underlying the common <Cmd> system.
 */
const setup: t.CmdTestSetup = async () => {
  const { dispose, dispose$ } = rx.disposable();
  const factory: t.CmdTestFactory = async () => Immutable.clonerRef({});
  const res: t.CmdTestState = { doc: await factory(), factory, dispose, dispose$ };
  return res;
};
