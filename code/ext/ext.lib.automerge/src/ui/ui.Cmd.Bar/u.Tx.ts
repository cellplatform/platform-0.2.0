import { DEFAULTS, slug, type t } from './common';

type Parsed = {
  ok: boolean;
  instance: string;
  tx: string;
  cmd?: t.CmdBarAction;
  raw: string;
  error?: string;
};
const ERROR = { ok: false, instance: '', tx: '' };

/**
 * Helpers for generating change {tx} transaction ids.
 */
export const Tx = {
  unknown: 'unknown',

  is: {
    validInstance(instance: string) {
      return !instance.includes(':');
    },

    validAction(action: string) {
      return DEFAULTS.actions.includes(action as any);
    },
  },

  ensure: {
    validInstance(instance: string) {
      if (!Tx.is.validInstance(instance)) throw new Error('instance cannot contain colon');
    },

    validAction(action: string) {
      if (!Tx.is.validAction(action)) throw new Error(`invalid action type: "${action}".`);
    },
  },

  next(instance: string, action: t.CmdBarAction) {
    instance = (instance || '').trim();
    Tx.ensure.validInstance(instance);
    Tx.ensure.validAction(action);
    return `tx.${slug()}:inst.${instance || Tx.unknown}:cmd.${action}`;
  },

  parse(input: string): Parsed {
    const raw = input;
    input = (input || '').trim();

    const error = (error: string): Parsed => ({ ...ERROR, raw, error });
    if (!input) return error('No input');

    const parts = input.split(':');
    let tx = (parts[0] || '').trim();
    let instance = (parts[1] || '').trim();
    let cmd = (parts[2] || '').trim();

    if (!tx.startsWith('tx.')) return error('No "tx:"');
    if (!instance.startsWith('inst.')) return error('No "inst:"');
    if (!cmd.startsWith('cmd.')) return error('No "cmd:"');

    instance = instance.replace(/^inst\./, '').trim();
    tx = tx.replace(/^tx\./, '').trim();
    cmd = cmd.replace(/^cmd\./, '').trim();
    if (!instance) return error('No "inst:"');
    if (!tx) return error('No "tx:"');
    if (!cmd) return error('No "cmd:"');
    if (!Tx.is.validAction(cmd)) return error(`Invalid cmd action: "${cmd}"`);

    return {
      ok: true,
      instance,
      tx,
      cmd: cmd as t.CmdBarAction,
      raw,
    };
  },
} as const;
