import { t, rx, DEFAULTS, slug, Automerge } from './common';

/**
 * Saves log files to disk on each unit-change to the CRDT document.
 */
export function saveLogStrategy<D extends {} = {}>(
  fs: t.Fs,
  args: {
    doc: t.CrdtDocRef<D>;
    onChange$: t.Observable<t.CrdtDocRefChangeHandlerArgs<D>>;
    dispose$: t.Observable<any>;
    enabled: () => boolean;
    onSave: (e: t.CrdtFileActionSaved) => void;
  },
) {
  const { doc } = args;
  const logdir = fs.dir(DEFAULTS.doc.logdir);

  const save = async (change: Uint8Array) => {
    const count = (await logdir.manifest()).files.length;
    const filename = `${count}.${slug()}`;
    const { bytes, hash } = await logdir.write(filename, change);
    args.onSave({
      action: 'saved',
      kind: 'log',
      filename,
      bytes,
      hash,
    });
  };

  args.onChange$
    .pipe(
      rx.takeUntil(args.dispose$),
      rx.filter(() => args.enabled()),
      rx.filter((e) => e.change instanceof Uint8Array),
    )
    .subscribe((e) => save(e.change));

  if (args.enabled() && doc.history.length === 1) {
    const first = Automerge.getLastLocalChange(doc.current);
    if (first) save(first);
  }
}
