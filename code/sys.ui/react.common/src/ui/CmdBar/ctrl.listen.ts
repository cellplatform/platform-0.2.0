import { type t } from './common';

/**
 * Behavior logic for command signals.
 */
export function listen(
  cmd: t.Cmd<t.CmdBarCtrlType>,
  textbox: t.TextInputRef,
  dispose$?: t.UntilObservable,
): t.Lifecycle {
  const events = cmd.events(dispose$);

  events.on('Focus', (e) => textbox.focus(e.params.select));
  events.on('Blur', (e) => textbox.blur());
  events.on('Select:All', (e) => textbox.selectAll());
  events.on('Caret:ToStart', (e) => textbox.caretToStart());
  events.on('Caret:ToEnd', (e) => textbox.caretToEnd());


  return events;
}
