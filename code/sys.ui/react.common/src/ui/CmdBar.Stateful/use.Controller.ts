import { useEffect, useState } from 'react';
import { DEFAULTS, ObjectPath, rx, type t } from './common';

type P = t.CmdBarStatefulProps;

export function useController(props: P) {
  const { state, paths = DEFAULTS.paths } = props;

  const [ready, setReady] = useState(false);
  const [textbox, setTextbox] = useState<t.TextInputRef>();
  const [cmdbar, setCmdbar] = useState<t.CmdBarCtrl>();
  const [isFocused, setFocused] = useState(false);

  const [_, setRedraw] = useState(0);
  const redraw = () => setRedraw((n) => n + 1);

  /**
   * Enabled state.
   */
  let enabled = props.enabled ?? true;
  if (!state) enabled = false;
  if (!textbox) enabled = false;

  /**
   * Ready (→ Dispose)
   * NB:
   *     Textbox ←|→ State (Immutable<T>) syncer
   *
   *     The instance specific syncer controller should
   *     activate within the onReady callback.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (ready && textbox && cmdbar) {
      const text = api.text;
      props.onReady?.({ text, textbox, cmdbar, paths, dispose$ });
    }
    return dispose;
  }, [ready, state?.instance, !!textbox, paths.text.join('.')]);

  /**
   * <State> document change listener.
   */
  useEffect(() => {

  /**
   * API: Event Handlers
   */
  const onReady: t.CmdBarReadyHandler = (e) => {
    if (ready) return;
    setTextbox(e.textbox);
    setCmdbar(e.cmdbar);
    setReady(true);
  };

  const onChange: t.CmdBarChangeHandler = (e) => {
    redraw();
    props.onChange?.(e);
  };

  const onSelect: t.TextInputSelectHandler = (e) => {
    props.onSelect?.(e);
  };

  const onFocusChange: t.TextInputFocusHandler = (e) => {
    setFocused(e.is.focused);
    props.onFocusChange?.(e);
  };

  /**
   * API
   */
  const api = {
    ready,
    enabled,
    handlers: { onReady, onChange, onSelect, onFocusChange },
    get text() {
      if (!state) return '';
      return ObjectPath.resolve<string>(state.current, paths.text) || '';
    },
    get hintKey(): string | string[] | undefined {
      if (!isFocused) return 'META + K';
      return;
    },
  } as const;
  return api;
}
