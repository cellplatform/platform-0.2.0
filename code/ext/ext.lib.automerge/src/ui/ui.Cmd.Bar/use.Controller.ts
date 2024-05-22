import { useEffect, useState, useRef } from 'react';
import { DEFAULTS, Sync, rx, type t } from './common';
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
      setText(resolve.text(doc.current)); // initial.

      const { dispose$ } = life;
      const listener = Sync.Textbox.listen(textbox, doc, path.text, { debug, dispose$ });
      listener.onChange((e) => {
        console.log('onChange', e);
        setText(e.text);
      });
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
  return {
    is: { enabled },
    text: text || undefined,
    onReady: (ref: t.TextInputRef) => setTextbox(ref),
    onChange: (text: string) => setText(text),
  } as const;
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
