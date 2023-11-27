import { PatchState, slug, Time, type t } from './common';
import { get as createGetter } from './List.get';

/**
 * Dispatcher of "command" events for the given item.
 */
export function commands(list?: t.LabelListState) {
  const dispatch = PatchState.Command.dispatcher(list);
  const get = createGetter(list);

  const api: t.LabelListDispatch = {
    select(target, focus = false) {
      const item = get.index(target);
      dispatch({ type: 'List:Select', payload: { item, focus, tx: slug() } });
    },
    edit(target, action = 'start') {
      const item = get.item(target)?.instance;
      if (item) {
        const tx = slug();
        dispatch({ type: 'List:Select', payload: { item, focus: true, tx } });
        dispatch({ type: 'List:Edit', payload: { item, action, tx } });
      }
    },
    redraw(target) {
      const item = get.index(target);
      dispatch({ type: 'List:Redraw', payload: { item, tx: slug() } });
    },
    remove(target) {
      const index = get.index(target);
      if (index < 0) return;
      dispatch({ type: 'List:Remove', payload: { index, tx: slug() } });
    },
    focus() {
      dispatch({ type: 'List:Focus', payload: { focus: true, tx: slug() } });
    },
    blur() {
      dispatch({ type: 'List:Focus', payload: { focus: false, tx: slug() } });
    },
  };
  return api;
}

/**
 * Helpers
 */
export const Wrangle = {
  itemId(list?: t.LabelListState, target?: t.LabelListItemTarget) {
    const getItem = list?.current.getItem;
    if (!getItem || target === undefined) return '';
    const [item, index] = getItem(target);
    return item?.instance ?? '';
  },
} as const;
