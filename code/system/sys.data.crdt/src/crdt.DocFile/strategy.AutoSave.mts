import { t, rx, DEFAULTS } from './common';

type Milliseconds = number;

/**
 * Saves the document after (debouned) changes.
 */
export function autoSaveStrategy<D extends {} = {}>(
  file: t.CrdtDocFile<D>,
  args: {
    enabled: () => boolean;
    debounce?: Milliseconds;
  },
) {
  const { debounce = DEFAULTS.doc.autosaveDebounce } = args;

  file.doc.$.pipe(
    rx.takeUntil(file.dispose$),
    rx.filter(() => args.enabled()),
    rx.filter((e) => e.action === 'change' || e.action === 'replace'),
    rx.debounceTime(debounce),
  ).subscribe(() => file.save());
}
