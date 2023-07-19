import { type t } from './common';

/**
 * UI View: Namespace
 */
export type CrdtNsProps = {
  enabled?: boolean;
  data?: t.CrdtNsInfoData;
  useBehaviors?: t.LabelItemBehaviorKind[];
  style?: t.CssValue;
  indent?: number;
};

/**
 * DATA:
 * Properties for when inserting within the <Info>.
 */
export type CrdtNsInfoData = {
  title?: string;
  ns?: t.CrdtNsManager<{}>;
  maxLength?: number;
  onChange?: t.LabelItemChangeHandler;
};
