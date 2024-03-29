import { Doc, rx, type t } from '../../test.ui';
export type TDoc = { text?: string };

/**
 * Sync listener.
 */
export function listen(
  doc: t.DocRef<TDoc>,
  input: t.TextInputRef,
  input$: t.Observable<t.TextInputChangeEvent>,
  dispose$: t.UntilObservable,
  options: {
    debug?: string;
    onChange?(e: { text: string; pos: t.Index }): void;
  } = {},
) {
  const { debug = 'unknown' } = options;

  /**
   * Changes from <input>
   */
  input$
    .pipe(
      rx.takeUntil(dispose$),
      rx.map((e) => Calc.diff(e.from, e.to, e.selection.start)),
      rx.filter((diff) => diff.index >= 0),
    )
    .subscribe((diff) => {
      doc.change((d) => {
        if (!d.text) d.text = '';
        Doc.splice(d, ['text'], diff.index, diff.delCount, diff.newText);
      });
    });

  /**
   * Change from CRDT
   */
  doc
    .events(dispose$)
    .changed$.pipe(rx.filter((e) => e.doc.text !== input.current))
    .subscribe((e) => {
      const pos = input.selection.start;
      const text = e.doc.text || '';
      options.onChange?.({ text, pos });
    });
}

/**
 * Helpers
 */

const Calc = {
  /**
   * TODO 🐷
   */
  diff(from: string, to: string, caret: t.Index) {
    const index = Calc.firstDiff(from, to);
    const delCount = from.length - index - (to.length - caret);
    const newText = to.slice(caret - (to.length - from.length), caret);
    return { index, delCount, newText } as const;
  },

  firstDiff(from: string, to: string) {
    let index = 0;
    while (index < from.length && index < to.length && from[index] === to[index]) {
      index++;
    }
    return index;
  },
} as const;
