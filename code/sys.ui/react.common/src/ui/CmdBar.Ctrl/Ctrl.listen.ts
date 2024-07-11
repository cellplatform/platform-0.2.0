import { DEFAULTS, type t } from './common';
import { CtrlKeyboard } from './Ctrl.keyboard';

/**
 * Behavior logic for command signals.
 */
export function listen(args: {
  ctrl: t.CmdBarCtrl;
  textbox: t.TextInputRef;
  useKeyboard?: boolean;
  dispose$?: t.UntilObservable;
}): t.Lifecycle {
  const { ctrl, textbox, useKeyboard = DEFAULTS.useKeyboard } = args;
  const cmd = ctrl._;
  const events = cmd.events(args.dispose$);
  const isFocused = () => textbox.current.focused;

  if (useKeyboard) CtrlKeyboard.listen(ctrl, textbox, events.dispose$);

  events.on('Current', (e) => {
    const text = textbox.current.value;
    cmd.invoke('Current:res', { text }, e.tx);
  });

  events.on('Focus', (e) => {
    const { target = 'CmdBar' } = e.params;
    if (target === 'CmdBar') {
      textbox.focus();
      textbox.caretToEnd();
    }
  });
  events.on('Select', (e) => {
    const scope = e.params.scope ?? 'All';
    if (scope === 'All') textbox.selectAll();
    if (scope === 'Expand') CtrlKeyboard.expandedSeletion(textbox);
    if (scope === 'Toggle:Full') CtrlKeyboard.toggleFullSelection(textbox);
  });

  events.on('Caret:ToStart', (e) => textbox.caretToStart());
  events.on('Caret:ToEnd', (e) => textbox.caretToEnd());
  events.on('Keyboard', (e) => CtrlKeyboard.handleKeyAction(ctrl, e.params, isFocused()));

  return events;
}
