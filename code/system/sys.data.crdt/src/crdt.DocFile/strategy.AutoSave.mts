import { t, rx } from './common';

type Milliseconds = number;

/**
 * Saves the document after (debouned) changes.
 */
export function autoSaveStrategy<D extends {} = {}>(
  file: t.CrdtDocFile<D>,
  debounce: Milliseconds = 300,
) {
  file.doc.$.pipe(
    rx.takeUntil(file.dispose$),
    rx.debounceTime(debounce),
    rx.filter((e) => e.action === 'change' || e.action === 'replace'),
  ).subscribe(() => file.save());
}
