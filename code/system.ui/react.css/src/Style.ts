import { type t } from './common';

export type CssProps = t.CssProps;
export type CssValue = t.CssValue;

export { Global, Global as global } from './style.Css/global';
export { format, transform, image, head } from './style.Css';
export {
  toEdges,
  toMargins,
  toPadding,
  toShadow,
  toPosition,
  toAbsolute,
  toRadius,
} from './style.Css/util';
