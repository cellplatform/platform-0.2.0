import { eventsFactory } from './Model.Events';
import { ItemModel } from './Model.Item';
import { GetItem } from './Model.List.GetItem';
import { listBehavior } from './Model.List.b';
import { listRedrawBehavior } from './Model.List.b.redraw';
import { listSelectionBehavior } from './Model.List.b.selection';
import { DEFAULTS, Model, WebStore, StoreIndex, rx, type t } from './common';

type Options = {
  dispose$?: t.UntilObservable;
  filter?: t.StoreIndexFilter;
  behaviors?: t.RepoListBehavior[] | (() => t.RepoListBehavior[]);
} & t.RepoListHandlers;

export const List = {
  /**
   * Initialise a new state model for a Repo.
   */
  async init(store: t.WebStore, options: Options = {}) {
    const life = rx.lifecycle(options.dispose$);
    const { dispose$, dispose } = life;
    const { filter = DEFAULTS.filter } = options;
    const index = await WebStore.index(store);
    const total = StoreIndex.Filter.docs(index.doc.current, filter).length + 1;
    const handlers = wrangle.handlers(options);

    /**
     * Model.
     */
    const ctx: t.GetRepoListModel = () => model;
    const array = Model.List.array(() => ItemModel.state(ctx, 'Doc', { dispose$ }));
    const getItem = GetItem(ctx, array);
    const state: t.RepoListState = Model.List.state(
      { total, getItem },
      { type: DEFAULTS.typename.List, dispose$ },
    );

    /**
     * API.
     */
    const dispatch = Model.List.commands(state);
    const model: t.RepoListModel = {
      store,
      index,
      filter,
      handlers,
      list: { state, dispatch },
      get behaviors() {
        return wrangle.behaviors(options);
      },
      events: (dispose$?: t.UntilObservable) => eventsFactory({ ctx, dispose$ }),

      // Lifecycle.
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    };

    /**
     * Behaviors.
     */
    listBehavior({ ctx });
    listSelectionBehavior({ ctx });
    listRedrawBehavior({ ctx, array });

    // Finish up.
    return model;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  handlers(options: Options = {}): t.RepoListHandlers {
    const { onShareClick, onDatabaseClick, onActiveChanged } = options;
    return { onShareClick, onDatabaseClick, onActiveChanged } as const;
  },

  behaviors(options: Options = {}) {
    const { behaviors = DEFAULTS.behaviors.default } = options;
    return typeof behaviors === 'function' ? behaviors() : behaviors;
  },
} as const;
