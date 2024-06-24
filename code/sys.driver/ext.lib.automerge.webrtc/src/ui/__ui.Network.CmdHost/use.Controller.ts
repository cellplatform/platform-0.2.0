import { useEffect, useState } from 'react';
import { CmdHost, DEFAULTS, Doc, ObjectPath, Sync, rx, type t } from './common';
import { CmdHostPath } from './u';

/**
 * Controls the interaction between a <CmdHost> and a CRDT document.
 */
export function useController(args: {
  enabled?: boolean;
  doc?: t.Lens | t.DocRef;
  path?: t.CmdHostPaths;
  imports?: t.ModuleImports;
  debug?: string;
  onLoad?: t.CmdHostLoadHandler;
  onCommand?: t.CmdHostCommandHandler;
}) {
  const { enabled = true, doc, path = DEFAULTS.paths, imports, debug } = args;
  const resolve = CmdHostPath.resolver(path);

  const [listEnabled, setListEnabled] = useState(true);
  const [selectedUri, setSelectedUri] = useState('');
  const [textbox, setTextbox] = useState<t.TextInputRef>();
  const [cmd, setCmd] = useState('');

  const isFilter = (command: string) => (command || '').trimStart().startsWith('?');
  const filter: t.CmdHostFilter = (imports, command) => {
    const cmd = (command || '').trim();
    if (!isFilter(cmd)) return imports;
    return CmdHost.DEFAULTS.filter(imports, cmd.replace(/^\?/, ''));
  };

  /**
   * Document actions.
   */
  const Action = {
    clearCommand() {
      doc?.change((d) => {
        const cmd = resolve.cmd.text(d);
        if (cmd) Doc.Text.splice(d, path.cmd.text, 0, cmd.length);
      });
    },
    unload() {
      doc?.change((d) => ObjectPath.mutate(d, path.uri.loaded, ''));
    },
  } as const;

  /**
   * Runs when a command is invoked.
   */
  const invokeCommand = (e: t.CmdHostDocObject) => {
    const text = e.cmd.text.trim();
    const res = { clearCmd: false, unload: false };
    args.onCommand?.({
      cmd: { text, clear: () => (res.clearCmd = true) },
      unload: () => (res.unload = true),
    });
    if (res.clearCmd) Action.clearCommand();
    if (res.unload) Action.unload();
  };

  /**
   * Textbox CRDT syncer (splice).
   */
  useEffect(() => {
    const life = rx.disposable();
    const { dispose$ } = life;
    if (enabled && doc && textbox) {
      const listener = Sync.Textbox.listen(textbox, doc, path.cmd.text, { dispose$ });
      listener.onChange((e) => setCmd(e.text));
      setCmd(resolve.cmd.text(doc.current)); // initial.
    }
    return life.dispose;
  }, [enabled, doc?.instance, !!textbox, path.cmd.text.join('.')]);

  /**
   * Doc change listeners.
   */
  useEffect(() => {
    const events = doc?.events();
    if (enabled && events && doc) {
      const { tap, distinctWhile, debounceTime, filter } = rx;
      const mutate = ObjectPath.mutate;
      const $ = events.changed$.pipe(rx.map((d) => resolve.doc(d.after)));

      // Command text.
      $.pipe(
        tap(),
        distinctWhile((p, n) => p.cmd.text === n.cmd.text),
      ).subscribe((e) => setCmd(e.cmd.text));

      // Selected URI.
      $.pipe(
        tap(),
        distinctWhile((p, n) => p.uri.selected === n.uri.selected),
      ).subscribe((e) => setSelectedUri(e.uri.selected));

      // Load (⚡️:action).
      $.pipe(
        tap(),
        distinctWhile((p, n) => p.uri.loaded === n.uri.loaded),
      ).subscribe((e) => {
        const uri = e.uri.loaded;
        const cmd = e.cmd.text;
        setListEnabled(!uri);
        args.onLoad?.({ uri, cmd });
      });

      // Set "Loaded" URI (on invoke).
      $.pipe(
        distinctWhile((p, n) => p.cmd.invoked === n.cmd.invoked),
        distinctWhile((p, n) => p.uri.selected === n.uri.selected && p.uri.loaded === n.uri.loaded),
        filter((d) => d.cmd.text === '' || isFilter(d.cmd.text)), // TEMP: 🐷 change this to disabled when text, and filter added as stack/prefix.
      ).subscribe((e) => doc.change((d) => mutate(d, path.uri.loaded, e.uri.selected)));

      // Command (⚡️:action).
      $.pipe(
        distinctWhile((p, n) => p.cmd.invoked === n.cmd.invoked),
        debounceTime(10),
      ).subscribe((e) => invokeCommand(e));
    }

    return events?.dispose;
  }, [enabled, doc?.instance, !!imports]);

  /**
   * API
   */
  const api = {
    filter,
    cmd,
    textbox,
    selectedUri,

    is: {
      enabled,
      get listEnabled() {
        if (!(enabled && listEnabled)) return false;
        if (cmd && !isFilter(cmd)) return false; // TEMP: 🐷 change this to disabled when text, and filter added as stack/prefix.
        return true;
      },
      get loaded() {
        const res = !!resolve.uri.loaded(doc?.current);
        return res;
      },
    },

    onTextboxReady(textbox: t.TextInputRef) {
      setTextbox(textbox);
    },

    onSelectionChange(uri?: t.UriString) {
      doc?.change((d) => ObjectPath.mutate(d, path.uri.selected, uri || ''));
    },

    onInvoke() {
      doc?.change((d) => resolve.cmd.invoked(d)?.increment(1));
    },
  } as const;
  return api;
}
