import { Cmd } from '.';
// import { Doc, Store } from '../crdt';
import { commandTests, type C, Time, describe, expect, it, type t, Immutable, rx } from '../test';

type P = t.PatchOperation;

/**
 * TODO 🐷
 */
const setup: t.CmdTestSetup = async () => {
  // const store = Store.init();
  const { dispose, dispose$ } = rx.disposable();
  // const { dispose$ } = store;
  // const dispose = () => store.dispose();
  // const factory: t.CmdTestDocFactory = () => Immutable.clonerRef({});
  // const res: t.CmdTestState = { doc: await factory(), factory, dispose, dispose$ };
  // const m = Immutable.clonerRef({});

  return null as any; // TEMP 🐷
  // return res;
};

describe('crdt.cmd (Command)', () => {
  /**
   * Standardised test suite for the <Cmd> system.
   */
  // commandTests(setup, { describe, it, expect });
});
