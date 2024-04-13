/**
 * @external
 */
export type { CSSProperties } from 'react';

/**
 * @system
 */
export type {
  CommonTheme,
  DomRect,
  EdgePos,
  EdgePosition,
  EdgePositionInput,
  EdgePositionX,
  EdgePositionY,
  Margin,
  MarginInput,
  PixelOffset,
  Pixels,
  RenderInput,
  RenderOutput,
} from 'sys.types/src/types';
export type {
  KeyboardKeypress,
  KeyboardModifierFlags,
  KeyboardModifierKeys,
  KeyboardState,
  KeyboardStateCurrent,
  LocalStorage,
} from 'sys.ui.dom/src/types';
export type { CssEdgesInput, CssRadiusInput, CssValue } from 'sys.ui.react.css/src/types';

/**
 * @local
 */
export type { DevCtx, DevCtxState } from './common/t';
export type * from './ui.dev/t';
export type * from './ui.tools/t';
export type * from './ui/t';
