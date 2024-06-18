import { Cmd } from '.';
// import { Doc, Store } from '../crdt';
import { Time, describe, expect, it, type t, Immutable, rx } from '../test';
import { commandTests, type C } from './Cmd.tests';


describe('crdt.cmd (Command)', () => {
  /**
   * Standardised test suite for the <Cmd> system.
   */
  commandTests(setup, { describe, it, expect });
});
