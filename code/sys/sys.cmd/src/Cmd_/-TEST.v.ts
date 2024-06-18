import { Cmd } from '.';
// import { Doc, Store } from '../crdt';
import { Time, describe, expect, it, type t, Immutable, rx } from '../test';
import { commandTests, type C } from './Cmd.tests';

type P = t.PatchOperation;

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
