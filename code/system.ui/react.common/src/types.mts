/**
 * @external
 */
export type { CSSProperties } from 'react';

/**
 * @system
 */
export type {
  DomRect,
  Pos,
  Position,
  PositionInput,
  PositionX,
  PositionY,
} from 'sys.types/src/types.mjs';
export type {
  KeyboardKeypress,
  KeyboardState,
  KeyboardStateCurrent,
} from 'sys.ui.dom/src/types.mjs';
export type { CssEdgesInput, CssRadiusInput, CssValue } from 'sys.ui.react.css/src/types.mjs';

/**
 * @local
 */
export type { DevCtx, DevCtxState } from './common/types.mjs';
export type * from './ui.dev/types.mjs';
export type * from './ui.tools/types.mjs';
export type * from './ui/types.mjs';

/**
 * Common Types
 */
export type CommonTheme = 'Light' | 'Dark';
