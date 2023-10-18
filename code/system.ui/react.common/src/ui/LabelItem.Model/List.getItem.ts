import { PatchState, type t } from './common';

type O = Record<string, unknown>;

/**
 * Create a new observable List state object.
 */
export function getItem<A extends t.LabelItemActionKind = string, D extends O = O>(
  state: t.LabelList | t.LabelListState | undefined,
  index: number,
): t.LabelItemStateIndex<A, D> {
  const notFound: t.LabelItemStateIndex<A, D> = [undefined, -1];
  if (!state) return notFound;

  const current = PatchState.Is.state(state) ? state.current : state;
  if (!current?.getItem) return notFound;
  if (index < 0 || index > current.length - 1) return notFound;

  const res = current.getItem(index);
  return res ? (res as t.LabelItemStateIndex<A, D>) : notFound;
}
