/**
 * @external
 */
export type { Observable, Subject } from 'rxjs';
export type { CSSProperties } from 'react';

/**
 * @system
 */
export type {
  DomRect,
  Disposable,
  EventBus,
  IgnoredResponse,
  JsonU,
  JsonMapU,
  Size,
} from 'sys.types/src/types.mjs';

export type { CssValue, CssEdgesInput, CssShadow } from 'sys.ui.react.css/src/types.mjs';
export type { TextCharDiff } from 'sys.text/src/types.mjs';
export type { TimeDelayPromise } from 'sys.util/src/types.mjs';

export type {
  TestSuiteModel,
  TestSuiteRunResponse,
  TestRunResponse,
  TestHandlerArgs,
  SpecImports,
  SpecImport,
} from 'sys.test.spec/src/types.mjs';

export type {
  DevCtx,
  DevCtxInput,
  DevCtxState,
  DevEvents,
  DevInfo,
  DevCtxDebug,
  DevCtxEdge,
  DevTheme,
  DevValueHandler,
  DevRenderRef,
  DevRenderer,
  DevRenderProps,
  DevRedrawTarget,
} from 'sys.ui.react.dev.types/src/types.mjs';

export type {
  SpecListBadge,
  SpecListChildVisibilityHandler,
  SpecListChildVisibility,
  SpecListScrollTarget,
} from 'sys.ui.react.dev/src/types.mjs';

export type {
  UIEventBase,
  UIModifierKeys,
  KeyboardState,
  KeyboardKeypress,
  KeyboardKeypressProps,
  KeyboardModifierEdges,
  KeyboardModifierFlags,
  KeyMatchSubscriberHandlerArgs,
} from 'sys.ui.dom/src/types.mjs';

/**
 * @local
 */
export * from '../types.mjs';
export type UrlInput = string | URL | Location;
export type MarginInput = number | [number] | [number, number] | [number, number, number, number];
export type Margin = [number, number, number, number];
