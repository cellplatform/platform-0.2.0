import { Cmd, type t } from './common';

/**
 * Flags for the <CmdBar>
 */
export const Is = {
  ctrl(input: any): input is t.CmdBarCtrl {
    if (input === null || typeof input !== 'object') return false;
    return Cmd.Is.cmd(input.cmd) && hasMethods(input);
  },
} as const;

/**
 * Helpers
 */
function areFuncs(...input: any[]) {
  return input.every((v) => typeof v === 'function');
}

function hasMethods(input: any) {
  if (input === null || typeof input !== 'object') return false;
  const o = input as t.CmdBarCtrl;
  return areFuncs(
    o.current,
    o.focus,
    o.select,
    o.caretToStart,
    o.caretToEnd,
    o.invoke,
    o.keyAction,
  );
}
