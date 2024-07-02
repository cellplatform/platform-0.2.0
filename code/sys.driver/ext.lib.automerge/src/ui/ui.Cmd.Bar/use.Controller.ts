import { useEffect, useRef, useState } from 'react';
import { Args, Cmd, DEFAULTS, Is, Sync, Time, rx, type t } from './common';
import { Events, Path } from './u';

type Args = {
  instance: string;
  enabled?: boolean;
  ctrl?: t.CmdBarCtrl;
  doc?: t.Lens | t.Doc;
  paths?: t.CmdBarPaths;
  debug?: string;
  focusOnReady?: boolean;
  handlers?: t.CmdBarHandlers;
};

type ReadyRef = 'focus' | 'onReady';

/**
 * State sync/interaction controller.
 */
export function useController(args: Args) {
  const { instance, ctrl, doc, handlers = {}, paths = DEFAULTS.paths } = args;

  const enabled = wrangle.enabled(args);
  const debug = wrangle.debug(args);
  const resolve = Path.resolver(paths);

  const cmdRef = useRef<t.CmdBarCommand>();
  const getCmd = (doc: t.Lens | t.Doc) => {
    type C = t.CmdBarType;
    if (!cmdRef.current) cmdRef.current = Cmd.create<C>(doc, paths.cmd) as t.CmdBarCommand;
    return cmdRef.current;
  };

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
    if (doc) {
      const ctx = () => ({ ctx: getCmd(doc) });
      events.text$.subscribe((e) => handlers.onText?.(e, ctx()));
      events.cmd.$.subscribe((e) => handlers.onCommand?.(e, ctx()));
      events.cmd.tx$.subscribe((e) => handlers.onInvoke?.(e, ctx()));
    }
    return events.dispose;
  }, [enabled, doc?.instance]);

  /**
   * <CmdBar> ctrl-command listener.
   */
  useEffect(() => {
    const events = ctrl?.events();
    events?.on('Invoke', (e) => {
      if (!doc) return;
      getCmd(doc).invoke('Invoke', { text, parsed: Args.parse(text) });
    });
    return events?.dispose;
  }, [enabled, ctrl, text]);

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
   * Ready
   */
  useEffect(() => {
    if (ready.includes('onReady')) return;
    if (doc) {
      const cmd = getCmd(doc);
      handlers.onReady?.({ cmd });
      ready.push('onReady');
    }
  }, [!!cmdRef.current, doc?.instance]);

  /**
   * API
   */
  const api = {
    text: text || undefined,
    get is() {
      return { enabled, lens: Is.lens(doc), doc: Is.doc(doc) };
    },
    onReady(ref: t.TextInputRef) {
      setTextbox(ref);
    },
    onChange(text: string, pos?: t.Index) {
      setText(text);
      if (textbox && typeof pos === 'number') Time.delay(0, () => textbox?.select(pos));
    },
    // onEnter() {
    // if (doc) getCmd(doc).invoke('Invoke', { text });
    // },
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
