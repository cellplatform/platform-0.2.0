import { type t } from './common';

/**
 * Component
 */
export type CanvasConfigProps = {
  title?: string;
  selected?: t.CanvasBehavior[];
  style?: t.CssValue;
  onClick?: t.PropListFieldSelectorClickHandler;
  onChange?: t.CanvasConfigHandler;
};

/**
 * Events
 */
export type CanvasConfigHandler = (e: CanvasConfigHandlerArgs) => void;
export type CanvasConfigHandlerArgs = {
  previous?: t.CanvasBehavior[];
  next?: t.CanvasBehavior[];
};
