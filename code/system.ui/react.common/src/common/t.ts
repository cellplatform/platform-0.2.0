/**
 * @external
 */
export type { CSSProperties } from 'react';
export type { Observable, Subject } from 'rxjs';

/**
 * @system
 */
export type {
  Axis,
  Disposable,
  DomRect,
  EdgePos,
  EdgePosition,
  EdgePositionInput,
  EdgePositionX,
  EdgePositionY,
  Event,
  EventBus,
  Falsy,
  IgnoredResponse,
  Immutable,
  ImmutableNext,
  ImmutableRef,
  JsonMapU,
  JsonU,
  Lifecycle,
  Milliseconds,
  ModuleDef,
  Msecs,
  PartialDeep,
  Percent,
  Pixels,
  Point,
  Seconds,
  Size,
  UntilObservable,
} from 'sys.types/src/types';

export type { PatchChange, PatchChangeHandler, PatchState } from 'sys.data.json/src/types';
export type {
  BundleImport,
  SpecImport,
  SpecImports,
  TestHandlerArgs,
  TestRunResponse,
  TestSuiteModel,
  TestSuiteRunResponse,
  TestSuiteRunStats,
} from 'sys.test.spec/src/types';
export type { TextCharDiff } from 'sys.text/src/types';
export type { CellAddress, TimeDelayPromise } from 'sys.util/src/types';

/**
 * @system → UI
 */
export type {
  KeyMatchSubscriberHandler,
  KeyMatchSubscriberHandlerArgs,
  KeyPressStage,
  KeyboardKeyFlags,
  KeyboardKeypress,
  KeyboardKeypressProps,
  KeyboardModifierEdges,
  KeyboardModifierFlags,
  KeyboardState,
  LocalStorage,
  UIEventBase,
  UIModifierKeys,
} from 'sys.ui.dom/src/types';
export type { CssEdgesInput, CssShadow, CssValue } from 'sys.ui.react.css/src/types';
export type {
  DevCtx,
  DevCtxDebug,
  DevCtxEdge,
  DevCtxInput,
  DevCtxState,
  DevEvents,
  DevInfo,
  DevRedrawTarget,
  DevRenderProps,
  DevRenderRef,
  DevRenderer,
  DevTheme,
  DevValueHandler,
  SpecItemChildVisibility,
  SpecListBadge,
  SpecListItemHandler,
  SpecListItemHandlerArgs,
  SpecListItemVisibilityHandler,
  SpecListScrollTarget,
} from 'sys.ui.react.dev/src/types';
export type {
  UseMouseDragHandler,
  UseMouseMovement,
  UseMouseProps,
} from 'sys.ui.react.util/src/types';

/**
 * @local
 */
export type * from '../types';
export type UrlInput = string | URL | Location;
export type MarginInput = number | [number] | [number, number] | [number, number, number, number];
export type Margin = [number, number, number, number];
