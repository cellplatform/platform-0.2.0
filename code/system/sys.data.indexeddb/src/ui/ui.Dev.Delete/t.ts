import type { t } from './common';

/**
 * <Component>
 */
export type DevDeleteProps = {
  filter?: t.DevDeleteFilter;
  style?: t.CssValue;
};

export type DevDeleteFilter = (e: DevDbItem) => boolean;

export type DevDbItem = {
  name: string;
  version: number;
  isDeletable?: boolean;
};

export type DevDbDeleteClickHandler = (e: DevDbDeleteClickHandlerArgs) => void;
export type DevDbDeleteClickHandlerArgs = {
  index: number;
  item: DevDbItem;
};
