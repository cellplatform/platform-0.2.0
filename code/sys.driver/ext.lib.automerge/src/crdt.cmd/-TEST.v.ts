import { Store } from '../crdt';
import { describe, expect, it, type t } from '../test';
import { commandTests } from './Cmd.tests';

describe('crdt.cmd (Command)', () => {
  commandTests({ setup, describe, it, expect });
});

/**
 * Helpers
 */
const setup: t.CmdTestSetup = async () => {
  const store = Store.init();
  const { dispose$ } = store;
  const factory = store.doc.factory((d) => d);
  const doc = await factory();
  const dispose = () => store.dispose();
  return { doc, factory, dispose, dispose$ } as const;
};
