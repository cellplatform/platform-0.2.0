import { Cmd, type t } from './common';

/**
 * Flags for the <CmdBar>
 */
export const Is = {
  ctrlMethods(input: any): input is t.CmdBarCtrlMethods {
    if (input === null || typeof input !== 'object') return false;
    return Cmd.Is.cmd(input.cmd) && Is.methods(input);
  },

  ctrl(input: any): input is t.CmdBarCtrl {
    if (input === null || typeof input !== 'object') return false;
    return Cmd.Is.cmd(input.cmd);
  },

  methods(input: any): input is t.CmdBarMethods {
    if (input === null || typeof input !== 'object') return false;
    const o = input as t.CmdBarMethods;
    return areFuncs(o.focus, o.blur, o.selectAll, o.caretToStart, o.caretToEnd, o.invoke);
  },
} as const;

/**
 * Helpers
 */
function areFuncs(...input: any[]) {
  return input.every((v) => typeof v === 'function');
}
