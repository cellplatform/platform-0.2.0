import { LabelItem, type t } from './common';

/**
 * API: Imperative handle reference.
 */
export function Ref(model: t.RepoListModel) {
  const { store, list } = model;
  const dispatch = LabelItem.Model.List.commands(list.state);
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
