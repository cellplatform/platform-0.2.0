import { useEffect, useState } from 'react';
import { Ctrl, DEFAULTS, ObjectPath, rx, type t } from './common';

type P = t.CmdBarStatefulProps;

export function useController(props: P) {
  const { state, paths = DEFAULTS.paths } = props;
  const pathDeps = wrangle.pathDeps(paths);

  const [ready, setReady] = useState(false);
  const [textbox, setTextbox] = useState<t.TextInputRef>();
  const [cmdbar, setCmdbar] = useState<t.CmdBarRef>();
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
   * Create the [cmdbar] command.
   */
  useEffect(() => {
    if (state) setCmdbar(Ctrl.create(state, { paths }));
  }, [state?.instance, pathDeps]);

  /**
   * Ready (→ Dispose)
   * NB:
   *     Textbox ←|→ State (Immutable<T>) syncer
   *
   *     The instance specific syncer controller should
   *     activate within the onReady callback.
   */
  useEffect(() => {
    const life = rx.disposable();
    const { dispose, dispose$ } = life;
    if (ready && state && textbox && cmdbar) {
      const text = api.text;
      props.onReady?.({
        text,
        textbox,
        cmdbar,
        state,
        paths,
        dispose$,
        events(dispose$) {
          return cmdbar._.events([life.dispose$, dispose$]);
        },
      });
    }
    return dispose;
  }, [ready, !!cmdbar, pathDeps, state?.instance, !!textbox]);

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
    cmdbar,
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

/**
 * Helpers
 */
const wrangle = {
  pathDeps(paths: t.CmdBarPaths) {
    return `${paths.text.join('.')}`;
  },
} as const;
