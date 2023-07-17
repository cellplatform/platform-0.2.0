import { type t } from '../common';
export * from '../common';

const props: t.LabelItemProps = {
  label: '',
};

const useControllerAll: t.LabelItemControllerKind[] = ['Edit', 'Selection'];
const useControllerDefault = useControllerAll;

export const DEFAULTS = {
  useControllers: {
    all: useControllerAll,
    default: useControllerDefault,
  },
  props,
  get data(): t.LabelItemData {
    return {};
  },
} as const;
