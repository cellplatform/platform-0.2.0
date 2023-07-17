import { type t } from '../common';
export * from '../common';

const props: t.LabelItemProps = {
  label: '',
};

const useBehaviorAll: t.LabelItemBehaviorKind[] = ['Edit', 'Selection'];
const useBehaviorDefault = useBehaviorAll;

export const DEFAULTS = {
  useBehaviors: {
    all: useBehaviorAll,
    default: useBehaviorDefault,
  },
  props,
  get data(): t.LabelItemData {
    return {};
  },
} as const;
