import { LabelItem, type t } from './common';

/**
 * API: Imperative handle reference.
 */
export function RepoListRef(args: { list: t.RepoListState; store: t.WebStore }) {
  const { store, list } = args;
  const dispatch = LabelItem.Model.List.commands(list);

  const api: t.RepoListRef = {
    store,

    /**
     * List methods.
     */
    select: dispatch.select,
    edit: dispatch.edit,
    redraw: dispatch.redraw,
    remove: dispatch.remove,
    focus: dispatch.focus,
    blur: dispatch.blur,
  };

  return api;
}
