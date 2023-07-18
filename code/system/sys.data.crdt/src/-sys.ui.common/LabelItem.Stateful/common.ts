import { type t } from '../common';
export * from '../common';

const useBehaviorAll: t.LabelItemBehaviorKind[] = ['Edit', 'Selection'];
const useBehaviorDefault = useBehaviorAll;

export const DEFAULTS = {
  enabled: true,
  editing: false,
  useBehaviors: {
    all: useBehaviorAll,
    default: useBehaviorDefault,
  },
  get data(): t.LabelItem {
    return {};
  },
} as const;
