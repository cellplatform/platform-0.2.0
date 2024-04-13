import { useEffect, useState } from 'react';
import { DEFAULTS, ObjectPath, Sync, rx, type t } from './common';
import { resolver } from './u';

type O = Record<string, unknown>;
type E = t.LensEvents | t.DocEvents;

/**
 * Controls the interaction between a <CmdHost> and a CRDT document.
 */
export function useController(args: {
  enabled?: boolean;
  doc?: t.Lens | t.DocRef;
  path?: t.CmdhostPaths;
  imports?: t.ModuleImports;
  debug?: string;
}) {
  const { enabled = true, doc, path = DEFAULTS.paths, debug, imports } = args;
  const [selected, setSelected] = useState(0);
  const [cmd, setCmd] = useState('');
  const [textbox, setTextbox] = useState<t.TextInputRef>();

  const resolve = resolver(path);
  function changedValue<T>(events: E | undefined, resolve: (doc: O) => T) {
    return events?.changed$.pipe(
      rx.filter(() => !!doc),
      rx.map((e) => e.after),
      rx.distinctWhile((prev, next) => resolve(prev) === resolve(next)),
      rx.map((after) => resolve(after)),
    );
  }

  /**
   * Textbox syncer (splice)
   */
  useEffect(() => {
    const life = rx.disposable();
    const { dispose$ } = life;
    if (enabled && doc && textbox) {
      const initial = resolve.cmd(doc.current);
      const listener = Sync.Textbox.listen(textbox, doc, path.cmd, { dispose$ });
      setCmd(initial ?? '');
      listener.onChange((e) => setCmd(e.text));
    }
    return life.dispose;
  }, [enabled, doc?.instance, !!textbox, path.cmd.join('.')]);

  /**
   * Selected index
   */
  useEffect(() => {
    const events = doc?.events();
    const changed$ = changedValue(events, (doc) => resolve.selected(doc) ?? 0);
    changed$?.subscribe((value) => setSelected(value));
    return events?.dispose;
  }, [enabled, doc?.instance, path.selected.join('.')]);

  /**
   * Importer
   */
  useEffect(() => {
    const events = doc?.events();
    const changed$ = changedValue(events, (doc) => resolve.address(doc) ?? '');

    changed$?.pipe(rx.filter((address) => !!address)).subscribe(async (address) => {
      const importer = imports?.[address];

      /**
       * TODO 🐷
       */
      console.log(debug, 'address', address, await importer?.());
    });
    return events?.dispose;
  }, [enabled, !!imports, doc?.instance]);

  /**
   * API
   */
  return {
    cmd,
    textbox,
    selected,
    async load(address?: string) {
      doc?.change((d) => ObjectPath.mutate(d, path.address, address));
    },
    onTextboxReady(textbox: t.TextInputRef) {
      setTextbox(textbox);
    },
    onSelectionChange(index: t.Index) {
      doc?.change((d) => ObjectPath.mutate(d, path.selected, index));
    },
  } as const;
}
