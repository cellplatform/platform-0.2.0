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
  icon: (e) => <Icons.Repo size={18} color={e.color} offset={[0, 2]} />,
};

const rightAction: t.LabelAction<K> | undefined = undefined;

export const DEFAULTS = {
  RUBY: 'rgba(255, 0, 0, 0.1)',
  debug: false,
  enabled: true,
  selected: false,
  editing: false,
  focused: false,
  focusOnReady: false,
  maxLength: 120,
  tabIndex: 0,
  indent: 0,
  padding: 5,
  borderRadius: 0,
  placeholder: 'placeholder',
  spinner: { width: 15 },
  leftAction,
  rightAction,
} as const;
