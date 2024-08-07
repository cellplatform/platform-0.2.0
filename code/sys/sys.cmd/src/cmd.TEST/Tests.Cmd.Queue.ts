import { Cmd } from '..';
import { Time, type t } from './common';

import type { C, C1 } from './t';
const DEFAULTS = Cmd.DEFAULTS;

export function queueTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  describe('Cmd.Queue', () => {
}
