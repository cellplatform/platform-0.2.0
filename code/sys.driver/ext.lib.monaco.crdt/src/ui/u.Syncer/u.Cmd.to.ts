import { DEFAULTS, type t } from './common';

/**
 * Convert a raw <Cmd> object into strongly typed methods API.
 */
export function toMethods(input: t.Cmd<t.SyncCmdType>) {
  const method = input.method;
  const methods: t.SyncCmdMethods = {
    ping: method('Ping', 'Ping:R'),
    purge: method('Purge', 'Purge:R'),
    update: {
      editor: method('Update:Editor'),
      state: method('Update:State'),
    },
  };
  (methods as any)[DEFAULTS.symbols.cmd] = input;
  return methods;
}

/**
 * Extract the raw <Cmd> object from a methods API object.
 */
export function toCmd(ctrl: t.SyncCmdMethods) {
  const methods = ctrl as any;
  return methods[DEFAULTS.symbols.cmd] as t.Cmd<t.SyncCmdType>;
}
