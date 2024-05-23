import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, Sync, Time, rx, type t } from './common';
import { Path } from './u';

type Args = {
  enabled?: boolean;
  doc?: t.Lens | t.DocRef;
  path?: t.CmdBarPaths;
  debug?: string;
  focusOnReady?: boolean;
};

type ReadyRef = 'focus';

/**
 * State sync/interaction controller.
 */
export function useController(args: Args) {
  const { doc, path = DEFAULTS.paths, debug } = args;
  const enabled = wrangle.enabled(args);
  const resolve = Path.resolver(path);

  const readyRef = useRef<ReadyRef[]>([]);
  const ready = readyRef.current;

  const [textbox, setTextbox] = useState<t.TextInputRef>();
  const [text, setText] = useState('');

  /**
   * Textbox CRDT syncer (splice).
   */
  useEffect(() => {
    const life = rx.disposable();
    if (enabled && doc && textbox) {
      const { dispose$ } = life;
      const listener = Sync.Textbox.listen(textbox, doc, path.text, { debug, dispose$ });
      listener.onChange((e) => api.onChange(e.text, e.pos));
      api.onChange(resolve.text(doc.current)); // initial.
    }
    return life.dispose;
  }, [enabled, doc?.instance, !!textbox, path.text.join('.')]);

  /**
   * Ready: focus.
   */
  useEffect(() => {
    if (ready.includes('focus')) return;
    if (enabled && textbox && args.focusOnReady) {
      textbox.focus();
      ready.push('focus');
    }
  }, [enabled, !!textbox, args.focusOnReady]);

  /**
   * API
   */
  const api = {
    is: { enabled },
    text: text || undefined,
    onReady: (ref: t.TextInputRef) => setTextbox(ref),
    onChange(text: string, pos?: t.Index) {
      setText(text);
      if (textbox && typeof pos === 'number') Time.delay(0, () => textbox.select(pos));
    },
  } as const;
  return api;
}

/**
 * Helpers
 */
const wrangle = {
  enabled(args: Args) {
    const { doc, enabled = true } = args;
    return doc ? enabled : false;
  },
} as const;
