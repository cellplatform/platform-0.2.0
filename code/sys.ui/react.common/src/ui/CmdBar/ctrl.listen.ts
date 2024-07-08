import { DEFAULTS, type t } from './common';
import { CtrlKeyboard } from './ctrl.keyboard';

/**
 * Behavior logic for command signals.
 */
export function listen(args: {
  cmdbar: t.CmdBarCtrl;
  textbox: t.TextInputRef;
  useKeyboard?: boolean;
  dispose$?: t.UntilObservable;
}): t.Lifecycle {
  const { cmdbar, textbox, useKeyboard = DEFAULTS.useKeyboard } = args;
  const cmd = args.cmdbar.cmd;
  const events = cmd.events(args.dispose$);

  if (useKeyboard) CtrlKeyboard.listen(cmdbar, textbox, events.dispose$);

  events.on('Focus', (e) => textbox.focus(e.params.select));
  events.on('Blur', (e) => textbox.blur());
  events.on('Select:All', (e) => textbox.selectAll());
  events.on('Caret:ToStart', (e) => textbox.caretToStart());
  events.on('Caret:ToEnd', (e) => textbox.caretToEnd());
  events.on('Key:Action', (e) => CtrlKeyboard.action(cmdbar, textbox, e.params));
  events.on('Current', (e) => {
    const text = textbox.current.value;
    cmd.invoke('Current:res', { text }, e.tx);
  });

  return events;
}
