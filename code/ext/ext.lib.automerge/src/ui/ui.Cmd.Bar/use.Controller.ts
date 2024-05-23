import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, Is, Sync, Time, rx, type t, ObjectPath } from './common';
import { Events, Path, Tx } from './u';

type Args = {
  instance: string;
  enabled?: boolean;
  doc?: t.Lens | t.DocRef;
  paths?: t.CmdBarPaths;
  debug?: string;
  focusOnReady?: boolean;
  handlers?: t.CmdBarHandlers;
};

type ReadyRef = 'focus';

/**
 * State sync/interaction controller.
 */
export function useController(args: Args) {
  const { instance, doc, handlers = {}, paths = DEFAULTS.paths } = args;
  Tx.ensure.validInstance(instance);

  const enabled = wrangle.enabled(args);
  const debug = wrangle.debug(args);
  const resolve = Path.resolver(paths);

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
      const listener = Sync.Textbox.listen(textbox, doc, paths.text, { debug, dispose$ });
      listener.onChange((e) => api.onChange(e.text, e.pos));
      api.onChange(resolve.text(doc.current)); // initial.
    }
    return life.dispose;
  }, [enabled, doc?.instance, !!textbox, paths.text.join('.')]);

  /**
   * CRDT document listeners.
   */
  useEffect(() => {
    const events = Events.create({ instance, doc, paths });
    events.text$.subscribe((e) => handlers.onTextChanged?.(e));
    events.cmd.$.subscribe((e) => handlers.onCommand?.(e));
    events.cmd.invoked$.subscribe((e) => handlers.onInvoked?.(e));
    return events.dispose;
  }, [enabled, doc?.instance]);

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
    text: text || undefined,
    get is() {
      return { enabled, lens: Is.lens(doc), doc: Is.docRef(doc) };
    },

    onReady(ref: t.TextInputRef) {
      setTextbox(ref);
    },
    onChange(text: string, pos?: t.Index) {
      setText(text);
      if (textbox && typeof pos === 'number') Time.delay(0, () => textbox?.select(pos));
    },
    onInvoke() {
      doc?.change((d) => {
        const tx = Tx.next(instance, 'Invoke');
        ObjectPath.mutate(d, paths.tx, tx);
      });
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

  debug(args: Args) {
    const { instance = 'Unknown', debug } = args;
    return debug ? `${debug}:${instance}` : instance;
  },
} as const;
