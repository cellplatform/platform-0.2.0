import { DEFAULTS, type t } from './common';
import { CtrlKeyboard } from './Ctrl.keyboard';

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
  const cmd = args.cmdbar._;
  const events = cmd.events(args.dispose$);

  if (useKeyboard) CtrlKeyboard.listen(cmdbar, textbox, events.dispose$);

  events.on('Current', (e) => {
    const text = textbox.current.value;
    cmd.invoke('Current:res', { text }, e.tx);
  });

  events.on('Invoke', (e) => {
    console.log('invoke', e); // TEMP 🐷
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
    if (scope === 'Expand') {
      const { value, selection } = textbox.current;
      const next = wrangle.expandedSeletion(value, selection);
      textbox.select(next.start, next.end);
    }
  });

  events.on('Caret:ToStart', (e) => textbox.caretToStart());
  events.on('Caret:ToEnd', (e) => textbox.caretToEnd());
  events.on('Key:Action', (e) => CtrlKeyboard.action(cmdbar, e.params, textbox.current.focused));

  return events;
}

/**
 * Helpers
 */
const wrangle = {
  expandedSeletion(text: string, selection: t.TextInputSelection): t.TextInputSelection {
    const index = wrangle.firstSpaceBeforeIndex(text, selection.start - 1);
    const start = index < 1 ? 0 : index;
    const end = text.length;
    return { start, end };
  },

  firstSpaceBeforeIndex(text: string, index: number): number {
    text = text.slice(0, index);
    for (let i = index - 1; i >= 0; i--) {
      if (text[i] === ' ') return i;
    }
    return -1;
  },
} as const;
