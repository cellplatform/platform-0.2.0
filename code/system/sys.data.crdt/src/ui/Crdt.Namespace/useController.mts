import { DEFAULTS, Item, type t } from './common';

type Args = {
  enabled?: boolean;
  ns?: t.CrdtNsManager<{}>;
  useBehaviors?: t.LabelItemBehaviorKind[];
};

/**
 * TODO 🐷
 * - Temporary state until item/group refactor.
 */
const itemState_TMP = Item.Label.State.item();

export function useController(args: Args) {
  const { ns, useBehaviors = DEFAULTS.useBehaviors } = args;
  const enabled = Boolean(ns) && (args.enabled ?? true);

  /**
   * TODO 🐷
   * - change this to [useController] ← (full list)
   */
  const controller = Item.Label.State.useItemController({
    // enabled: enabled && useBehaviors.includes('Edit'),
    useBehaviors,
    item: itemState_TMP,
    onChange(e) {
      /**
       * TODO 🐷
       */
      const item = itemState_TMP;

      console.group('🌳 within CRDT Namespace controller');
      console.log('e.action', e.action);
      console.log('ns', ns);
      console.log('⚡️ useController >> editController.onChange:', controller);
      console.log('item.current', item.current);
      console.groupEnd();

      const namespace = e.data.label ?? '';

      if (e.action === 'edit:accept') {
        if (namespace && ns) {
          const initial = { count: 0 };
          const lens = ns.lens(namespace, initial);
          console.log('lens', lens); // TEMP 🐷
        }
      }
    },
  });

  /**
   * TODO 🐷
   * - take root useController, not the editCongtroller
   */

  const { data, handlers } = controller;
  const api: t.LabelItemController<'controller:Crdt:Namespace'> = {
    kind: 'controller:Crdt:Namespace',
    enabled,
    data,
    handlers,
  };

  return api;
}
