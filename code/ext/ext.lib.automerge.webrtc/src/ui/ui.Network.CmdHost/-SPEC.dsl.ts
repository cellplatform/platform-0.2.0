import type { THarness } from './-SPEC.t';
import { type t } from './common';

/**
 * Command-line DSL.
 */
export function createDSL(args: { network: t.NetworkStore; harness: t.Lens<THarness> }) {
  const { network, harness } = args;
  return (e: t.CmdHostCommandHandlerArgs) => {
    const cmd = e.cmd.text.trim();

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

    if (cmd === 'copy' || cmd === 'copy.peer') {
      const peerid = network.peer.id;
      navigator.clipboard.writeText(`peer:${peerid}`);
      e.cmd.clear();
    }

    if (cmd.startsWith('connect ')) {
      const peer = network.peer;
      const id = String(cmd.split(' ')[1] || '').replace(/^peer\:/, '');
      const isSelf = peer.id === id;
      if (id && !isSelf) peer.connect.data(id);
    }
  };
}
