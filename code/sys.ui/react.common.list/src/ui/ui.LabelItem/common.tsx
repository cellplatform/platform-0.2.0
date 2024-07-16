import { Pkg, COLORS, Icons, type t } from '../common';
export * from '../common';

/**
 * Constants.
 */
type TActions = 'left:default';
type TLabelAction = t.LabelItemAction<TActions>;

const leftAction: TLabelAction = { kind: 'left:default' };
const rightAction: TLabelAction | undefined = undefined;

const renderers: t.LabelItemRenderers = {
  action(e, helpers) {
    if (e.kind === leftAction.kind) return <Icons.Repo {...helpers.icon(e, 18, [0, 1])} />;
    const opacity = e.selected && e.focused ? 0.3 : 0.2;
    return <Icons.Face {...helpers.icon(e, 18)} color={COLORS.MAGENTA} opacity={opacity} />;
  },
};

export const DEFAULTS = {
  displayName: `${Pkg.name}:LabelItem`,
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
  syntheticMousedownDetail: -1, // NB: used to signal to the consumer of a synthetically dispatched "mousedown" event.

  leftAction,
  rightAction,
  renderers,
} as const;
