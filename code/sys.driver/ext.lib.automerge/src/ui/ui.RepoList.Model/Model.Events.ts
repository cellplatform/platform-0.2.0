import { rx, toObject, type t } from './common';
import { Wrangle } from './u';

export function eventsFactory(args: {
  ctx: t.GetRepoListModel;
  dispose$?: t.UntilObservable;
}): t.RepoListEvents {
  const ctx = args.ctx();
  const life = rx.lifecycle([ctx.dispose$, args.dispose$]);
  const { dispose, dispose$ } = life;

  const events = {
    list: ctx.list.state.events(dispose$),
  } as const;

  const isActiveEvent = (e: t.RepoListCmdEvent) => e.type.startsWith('crdt:RepoList:active');
  const cmd$ = events.list.cmd.filter<t.RepoListCmdEvent>(isActiveEvent);

  const active$ = events.list.active.$.pipe(
    rx.map((e) => Wrangle.getItem(args.ctx, e.selected)!),
    rx.filter((e) => !!e),
    rx.map((e): t.RepoListActiveChangedEventArgs => {
      const { store, list, index } = args.ctx();
      const { position } = e;
      const kind = e.data.kind;
      const item = toObject(e.item);
      const focused = list.state.current.focused!;
      return { store, index, position, kind, item, focused };
    }),
  );

  /**
   * API
   */
  const api: t.RepoListEvents = {
    active$,
    deleting$: rx.payload<t.RepoListDeletingEvent>(cmd$, 'crdt:RepoList:active/deleting'),
    deleted$: rx.payload<t.RepoListDeletedEvent>(cmd$, 'crdt:RepoList:active/deleted'),

    /**
     * Lifecycle
     */
    dispose,
    dispose$,
    get disposed() {
      return life.disposed;
    },
  };

  return api;
}
