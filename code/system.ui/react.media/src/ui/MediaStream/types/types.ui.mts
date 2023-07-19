import { type t } from './common';

type ClickHandler = React.MouseEventHandler<HTMLDivElement>;

export type VideoProps = {
  stream?: MediaStream;
  width?: number;
  height?: number;
  borderRadius?: t.CssRadiusInput;
  backgroundColor?: string | number;
  muted?: boolean;
  tooltip?: string;
  style?: t.CssValue;
  onClick?: ClickHandler;
  onMouseDown?: ClickHandler;
  onMouseUp?: ClickHandler;
  onMouseEnter?: ClickHandler;
  onMouseLeave?: ClickHandler;
  onLoadedData?: React.ReactEventHandler<HTMLVideoElement>;
};
