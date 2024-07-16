import type { t } from './common';

/**
 * <Component>
 */
export type HashViewProps = {
  bg?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Events
 */
export type HashDropHandler = (e: HashDropHandlerArgs) => void;
export type HashDropHandlerArgs = {
  hash: string;
  data: Uint8Array;
  size: { bytes: number; display: string };
};
