import { Cmd, type t } from './common';

/**
 * Flags for the <CmdBar>
 */
export const Is = {
  methods(input: any): input is t.CmdBarMethods {
    if (input === null || typeof input !== 'object') return false;
    const o = input as t.CmdBarMethods;
    return areFuncs(o.focus, o.blur, o.selectAll, o.caretToStart, o.caretToEnd, o.invoke);
  },

  ctrl(input: any): input is t.CmdBarCtrlMethods {
    if (input === null || typeof input !== 'object') return false;
    return Cmd.Is.cmd(input.cmd) && Is.methods(input);
  },
} as const;

/**
 * Helpers
 */
function areFuncs(...input: any[]) {
  return input.every((v) => typeof v === 'function');
}
