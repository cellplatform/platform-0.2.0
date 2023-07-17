import { DEFAULTS, Item, type t } from './common';

type Args = {
  enabled?: boolean;
  ns?: t.CrdtNsManager<{}>;
};

/**
 * TODO 🐷
 * - Temporary state until item/group refactor.
 */
const itemState_TMP = Item.state();

export function useController(args: Args) {
  const { ns } = args;
  const enabled = Boolean(ns) && (args.enabled ?? true);

  const editController = Item.useEditController({
    enabled,
    item: itemState_TMP,
    onChange(e) {
      /**
       * TODO 🐷
       */
      const item = itemState_TMP;

      console.group('🌳 within CRDT Namespace controller');
      console.log('e.action', e.action);
      console.log('ns', ns);
      console.log('⚡️ useController >> editController.onChange:', editController);
      console.log('item.current', item.current);
      console.groupEnd();

      const namespace = e.data.label ?? '';
      if (e.action === 'edit:accept') {
        if (namespace && ns) {
          const initial = { count: 0 };
          const lens = ns.lens(namespace, initial);

          console.log('lens', lens);
        }
      }
    },
  });

  const data = editController.data;
  const props = editController.props;

  const api: t.LabelActionController = {
    enabled,
    data,
    props: { ...props },
    handlers: editController.handlers,
  };

  return api;
}
