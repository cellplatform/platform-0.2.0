import { Icons, type t } from '../common';

export * from '../common';

export { Button } from '../Button';
export { Spinner } from '../Spinner';
export { TextInput } from '../Text.Input';
export { Keyboard } from '../Text.Keyboard';

/**
 * Constants.
 */
type K = 'left:default';

const leftAction: t.LabelAction<K> = {
  kind: 'left:default',
};

const rightAction: t.LabelAction<K> | undefined = undefined;

const renderers: t.LabelItemRenderers = {
  actions: {
    'left:default': (e) => <Icons.Repo size={18} color={e.color} offset={[0, 1]} />,
  },
};

export const DEFAULTS = {
  RUBY: 'rgba(255, 0, 0, 0.1)',
  debug: false,
  index: -1,
  total: -1,
  enabled: true,
  selected: false,
  editing: false,
  focused: false,
  focusOnReady: true,
  maxLength: 120,
  tabIndex: 0,
  indent: 0,
  padding: 5,
  borderRadius: 0,
  placeholder: 'placeholder',
  spinner: { width: 15 },
  leftAction,
  rightAction,
  renderers,
} as const;
