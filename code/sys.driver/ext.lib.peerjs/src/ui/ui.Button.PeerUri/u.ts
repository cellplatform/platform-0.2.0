import { DEFAULTS, type t } from './common';

export const Is = {
  defaultFontSize(value?: number) {
    return value === DEFAULTS.props.fontSize || value === undefined;
  },
} as const;
