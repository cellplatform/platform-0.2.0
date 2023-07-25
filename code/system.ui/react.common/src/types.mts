/**
 * @external
 */
export type { CSSProperties } from 'react';

/**
 * @system
 */
export type { DomRect } from 'sys.types/src/types.mjs';
export type { CssValue, CssEdgesInput, CssRadiusInput } from 'sys.ui.react.css/src/types.mjs';
export type {
  KeyboardState,
  KeyboardStateCurrent,
  KeyboardKeypress,
} from 'sys.ui.dom/src/types.mjs';

/**
 * @local
 */
export type * from './ui/types.mjs';
export type * from './ui.dev/types.mjs';
export type * from './ui.tools/types.mjs';
export type { DevCtx, DevCtxState } from './common/types.mjs';

/**
 * Common Types
 */
export type CommonTheme = 'Light' | 'Dark';
