import type { THarness } from './-SPEC.t';
import { type t } from './common';

/**
 * Command-line DSL.
 */
export function createDSL(args: { harness: t.Lens<THarness> }) {
  const { harness } = args;
  return (e: t.CmdHostCommandHandlerArgs) => {
    const cmd = e.cmd.text;

    if (cmd === 'close' || cmd === 'x') {
      e.cmd.clear();
      e.unload();
    }

    if (cmd === 'dev.hide') {
      harness.change((d) => (d.debugWidth = 0));
      e.cmd.clear();
    }

    if (cmd === 'dev.show') {
      harness.change((d) => (d.debugWidth = 330));
      e.cmd.clear();
    }
  };
}
