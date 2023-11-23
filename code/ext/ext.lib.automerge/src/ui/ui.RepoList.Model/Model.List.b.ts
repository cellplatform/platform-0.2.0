import { rx, type t } from './common';

/**
 * Behavior that monitors the index looking after the global list.
 */
export function listBehavior(args: { ctx: t.RepoListCtxGet }) {
  const { list, index, dispose$ } = args.ctx();
  const indexEvents = index.events(dispose$);

  // NB: After a new document is added, simply append 1 to the length of the list.
  //     The [getItem] data generator takes care of the rest.
  indexEvents.added$
    .pipe(rx.filter((e) => e.total !== list.state.current.total + 1))
    .subscribe((e) => {
      list.state.change((d) => (d.total = e.total + 1));
    });
}
