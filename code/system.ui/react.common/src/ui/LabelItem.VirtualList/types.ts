import type { t } from './common';

/**
 * <Component>
 */
export type RootProps = {
  list?: t.LabelListState;
  renderers?: t.LabelItemRenderers;
  style?: t.CssValue;
};
