/**
 * @external
 */
export type { CSSProperties } from 'react';

/**
 * @system
 */
export type {
  DomRect,
  EdgePos,
  EdgePosition,
  EdgePositionInput,
  EdgePositionX,
  EdgePositionY,
} from 'sys.types/src/types';
export type {
  KeyboardKeypress,
  KeyboardModifierFlags,
  KeyboardModifierKeys,
  KeyboardState,
  KeyboardStateCurrent,
  LocalStorage,
} from 'sys.ui.dom/src/types';
export type { CssEdgesInput, CssRadiusInput, CssValue } from 'sys.ui.react.css/src/types.mjs';

/**
 * @local
 */
export type { DevCtx, DevCtxState } from './common/types.mjs';
export type * from './ui.dev/types.mjs';
export type * from './ui.tools/types.mjs';
export type * from './ui/types';

/**
 * Common Types
 */
export type CommonTheme = 'Light' | 'Dark';
