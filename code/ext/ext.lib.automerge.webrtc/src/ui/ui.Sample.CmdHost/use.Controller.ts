import { useEffect, useState } from 'react';
import { DEFAULTS, ObjectPath, Sync, rx, type t } from './common';

type O = Record<string, unknown>;

/**
 * Controls the interaction between a <CmdHost> and a CRDT document.
 */
export function useController(args: {
  enabled?: boolean;
  doc?: t.Lens | t.DocRef;
  path?: t.CmdHostPaths;
  imports?: t.ModuleImports;
  debug?: string;
}) {
  const { enabled = true, doc, path = DEFAULTS.paths, debug, imports } = args;
  const [cmd, setCmd] = useState('');
  const [textbox, setTextbox] = useState<t.TextInputRef>();

  /**
   * Textbox syncer (splice)
   */
  useEffect(() => {
    const life = rx.disposable();
    const { dispose$ } = life;
    if (enabled && doc && textbox) {
      const initial = ObjectPath.resolve<string>(doc.current, path.cmd);
      const listener = Sync.Textbox.listen(textbox, doc, path.cmd, { dispose$ });
      listener.onChange((e) => setCmd(e.text));
      setCmd(initial ?? '');
    }
    return life.dispose;
  }, [enabled, doc?.instance, !!textbox, path.cmd.join('.')]);

  /**
   * Importer
   */
  useEffect(() => {
    const events = doc?.events();
    const resolve = (doc: O) => ObjectPath.resolve<string>(doc, path.address);

    const changed$ = events?.changed$?.pipe(
      rx.map((e) => e.after),
      rx.distinctWhile((prev, next) => resolve(prev) === resolve(next)),
    );

    changed$?.subscribe(async (doc) => {
      const address = resolve(doc) || '';
      const importer = imports?.[address];

      /**
       * TODO 🐷
       */
      console.group(debug);

      console.log('address', address);
      console.log('importer', importer);
      const m = await importer?.();
      console.log('m', m);

      console.groupEnd();
    });
    return events?.dispose;
  }, [!!imports, !!doc]);

  /**
   * API
   */
  return {
    cmd,
    textbox,
    onTextboxReady: (textbox: t.TextInputRef) => setTextbox(textbox),
    async load(address?: string) {
      doc?.change((d) => ObjectPath.mutate(d, path.address, address));
    },
  } as const;
}
