import { DEFAULTS, LabelItem, type t } from './common';

type Args = {
  enabled?: boolean;
  ns?: t.CrdtNsManager<{}>;
  useBehaviors?: t.LabelItemBehaviorKind[];
};

/**
 * TODO 🐷
 * - Temporary state until item/group refactor.
 */
const itemState_TMP = LabelItem.Stateful.State.item();

export function useController(args: Args) {
  const { ns, useBehaviors = DEFAULTS.useBehaviors } = args;
  const enabled = Boolean(ns) && (args.enabled ?? true);

  /**
   * TODO 🐷
   * - change this to [useController] ← (full list)
   */
  const controller = LabelItem.Stateful.useItemController({
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

      const namespace = e.item.label ?? '';

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

  const { current, handlers } = controller;
  const api: t.LabelItemController<'controller:Crdt:Namespace'> = {
    kind: 'controller:Crdt:Namespace',
    enabled,
    current,
    handlers,
  };

  return api;
}
