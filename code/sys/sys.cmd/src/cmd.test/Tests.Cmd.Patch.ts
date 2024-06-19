import { Cmd } from '..';
import { type t } from './common';

const Patch = Cmd.Patch;

export function patchTests(setup: t.CmdTestSetup, args: t.TestArgs) {
  const { describe, it, expect } = args;

  describe('Cmd.Patch', () => {});
}
