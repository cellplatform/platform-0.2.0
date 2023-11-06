import type { t } from './common';

/**
 * <Component>
 */
export type MediaToolbarProps = {
  peer?: t.PeerModel;
  dataId?: string;
  selected?: boolean;
  focused?: boolean;
  style?: t.CssValue;
};

export type MediaToolbarButtonProps = MediaToolbarProps & {
  kind: t.PeerConnectionMediaKind;
};
