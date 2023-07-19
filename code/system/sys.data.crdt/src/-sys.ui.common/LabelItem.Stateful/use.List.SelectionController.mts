import { type t } from './common';

type Args = {
  enabled?: boolean;
  ctx?: t.LabelItemListCtxState;
};

/**
 * HOOK: Selection behavior for a <List> of <Items>.
 */
export function useListSelectionController(args: Args) {
  const { enabled = true } = args;

  /**
   * TODO 🐷
   */
  console.log('💦 useListSelectionController', args);

  /**
   * API
   */
  const api: t.LabelListController<'controller:List.Selection'> = {
    kind: 'controller:List.Selection',
    enabled,
  } as const;
  return api;
}
