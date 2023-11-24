import { rx, type t } from './common';
import { Wrangle } from './u.Wrangle';

/**
 * Behavior that monitors the index looking after the global list.
 */
export function listBehavior(args: { ctx: t.RepoListCtxGet }) {
  const { list, index, filter, dispose$ } = args.ctx();
  const indexEvents = index.events(dispose$);

  const currentTotal = () => {
    return Wrangle.filterDocs(index.doc.current, filter).length;
  };

  // NB: After a new document is added, simply append 1 to the length of the list.
  //     The [getItem] data generator takes care of the rest.
  indexEvents.added$.pipe(rx.filter((e) => e.total !== currentTotal() + 1)).subscribe((e) => {
    list.state.change((d) => (d.total = currentTotal() + 1));
  });
}
