import { type t } from './common';
import { Wrangle } from './u.Wrangle';

/**
 * Behavior that monitors the index looking for redraw ques.
 */
export function listRedrawBehavior(args: { ctx: t.RepoListCtxGet }) {
  const { list, index, filter, dispose$ } = args.ctx();
  const events = index.events(dispose$);

  /**
   * REDRAW: on renames within the underlying [Index] model.
   */
  events.renamed$.pipe().subscribe((e) => {
    const { name } = e.item;
    const docs = Wrangle.filterDocs(index.doc.current, filter);
    const i = docs.findIndex((d) => d.uri === e.item.uri);
    const item = list.state.current.getItem?.(i)[0];
    if (item && item.current.label !== name) {
      item.change((d) => (d.label = name));
      list.dispatch.redraw(i);
    }
  });
}
