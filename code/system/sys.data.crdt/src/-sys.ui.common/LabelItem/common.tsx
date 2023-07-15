import { type t, Icons } from '../common';
export * from '../common';

type K = 'left:default';

const leftAction: t.LabelAction<K> = {
  kind: 'left:default',
  icon: (e) => <Icons.Repo size={18} color={e.color} offset={[0, 1]} />,
};

const rightActions: t.LabelAction<K>[] = [];

export const DEFAULTS = {
  enabled: true,
  selected: false,
  editing: false,
  focused: false,
  focusOnReady: false,
  maxLength: 120,
  tabIndex: 0,
  indent: 0,
  padding: 5,
  placeholder: 'placeholder',
  leftAction,
  rightActions,
} as const;
