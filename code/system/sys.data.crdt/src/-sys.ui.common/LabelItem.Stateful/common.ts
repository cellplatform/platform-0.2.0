import { type t } from '../common';
export * from '../common';

const useBehaviorAll: t.LabelItemBehaviorKind[] = ['Edit', 'Selection'];
const useBehaviorDefaults = useBehaviorAll;

export const DEFAULTS = {
  enabled: true,
  editing: false,
  useBehaviors: {
    all: useBehaviorAll,
    defaults: useBehaviorDefaults,
  },
  get data(): t.LabelItem {
    return {};
  },
} as const;
