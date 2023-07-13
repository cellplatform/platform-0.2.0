import { type t } from './common';

/**
 * UI View: Namespace
 */
export type CrdtNsProps = {
  enabled?: boolean;
  data?: t.CrdtNsInfoData;
  style?: t.CssValue;
};

/**
 * DATA:
 * Properties for when inserting within the <Info>.
 */
export type CrdtNsInfoData = {
  ns?: t.CrdtNsManager<{}>;
  maxLength?: number;
  onChange?: t.LabelItemChangeHandler;
};
