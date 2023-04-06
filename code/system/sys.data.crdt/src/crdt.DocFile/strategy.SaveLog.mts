import { t, rx, DEFAULTS, slug } from './common';

/**
 * Saves log files to disk on each unit-change to the CRDT document.
 */
export function saveLogStrategy<D extends {} = {}>(
  dir: t.Fs,
  args: {
    onChange$: t.Observable<t.CrdtDocRefChangeHandlerArgs<D>>;
    dispose$: t.Observable<any>;
    enabled: () => boolean;
    onSave: (e: t.CrdtFileActionSaved) => void;
  },
) {
  const { onChange$, dispose$, onSave } = args;
  const logdir = dir.dir(DEFAULTS.doc.logdir);

  onChange$
    .pipe(
      rx.takeUntil(dispose$),
      rx.filter(() => args.enabled()),
      rx.filter((e) => e.change instanceof Uint8Array),
    )
    .subscribe(async (e) => {
      const count = (await logdir.manifest()).files.length;
      const filename = `${count}.${slug()}`;
      const { bytes, hash } = await logdir.write(filename, e.change);
      onSave({
        action: 'saved',
        kind: 'log',
        filename,
        bytes,
        hash,
      });
    });
}
