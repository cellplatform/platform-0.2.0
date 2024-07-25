import { Pkg, COLORS, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'Button';

const spinner: t.ButtonSpinner = {
  width: 30,
  color: { enabled: COLORS.BLUE, disabled: COLORS.DARK },
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  enabled: true,
  active: true,
  block: false,
  spinning: false,
  disabledOpacity: 0.3,
  userSelect: false,
  pressedOffset: [0, 1] as [number, number],
  spinner,
  copy: {
    message: 'copied',
    fontSize: 12,
    delay: 1200,
    opacity: 0.6,
  },
} as const;
