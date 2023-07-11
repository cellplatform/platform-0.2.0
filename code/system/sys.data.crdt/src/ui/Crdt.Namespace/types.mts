import { type t } from './common';

/**
 * UI View: Namespace
 */
export type CrdtNsProps = {
  enabled?: boolean;
  data?: t.CrdtNsInfoData;
  style?: t.CssValue;
};

export type CrdtNsItemProps = {
  namespace?: string;
  data?: t.CrdtNsInfoData;
  enabled?: boolean;
  selected?: boolean;

  style?: t.CssValue;
  indent?: number;
  padding?: t.CssEdgesInput;
};

/**
 * DATA:
 * Properties for when inserting within the <Info>.
 */
export type CrdtNsInfoData = {
  ns?: t.CrdtNsManager<{}>;
  maxLength?: number;
  onChange?: CrdtNsItemChangeHandler;
};

export type CrdtNsItemChangeHandler = (e: CrdtNsItemChangeHandlerArgs) => void;
export type CrdtNsItemChangeHandlerArgs = {
  data: CrdtNsInfoData;
  namespace: string;
};
