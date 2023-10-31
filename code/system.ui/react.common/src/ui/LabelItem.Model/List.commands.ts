import { PatchState, slug, type t } from './common';

/**
 * Dispatcher of "command" events for the given item.
 */
export function commands(list?: t.LabelListState) {
  const dispatch = PatchState.Command.dispatcher(list);

  const api: t.LabelListDispatch = {
    select(item, focus = false) {
      dispatch({ type: 'List:Select', payload: { item, focus, tx: slug() } });
      return api;
    },
    edit(target, action = 'start') {
      const item = Wrangle.itemId(list, target);
      if (item) {
        api.select(item, true);
        dispatch({ type: 'List:Edit', payload: { item, action, tx: slug() } });
      }
      return api;
    },
    redraw(item) {
      dispatch({ type: 'List:Redraw', payload: { item, tx: slug() } });
      return api;
    },
    remove(index) {
      if (index === undefined || index < 0) return api;
      dispatch({ type: 'List:Remove', payload: { index, tx: slug() } });
      return api;
    },
    focus(focus: boolean = true) {
      dispatch({ type: 'List:Focus', payload: { focus, tx: slug() } });
      return api;
    },
    blur() {
      api.focus(false);
      return api;
    },
  };
  return api;
}

/**
 * Helpers
 */
export const Wrangle = {
  itemId(list?: t.LabelListState, target?: string | number) {
    const getItem = list?.current.getItem;
    if (!getItem || target === undefined) return '';
    const [item, index] = getItem(target);
    return item?.instance ?? '';
  },
} as const;
