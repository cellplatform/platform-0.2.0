/**
 * @external
 */
export type { ParsedArgs } from 'minimist';
export type { CSSProperties } from 'react';
export type { Observable, Subject } from 'rxjs';

/**
 * @ext
 */
export type {
  PatchChange,
  PatchChangeHandler,
  PatchOperation,
  PatchState,
  PatchStateEvents,
} from 'ext.lib.immer/src/types';

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
  ImageBadge,
  Immutable,
  ImmutableEvents,
  ImmutableMutator,
  ImmutableRef,
  Index,
  JsonMapU,
  JsonU,
  Lifecycle,
  Milliseconds,
  ModuleDef,
  ModuleImport,
  ModuleImporter,
  ModuleImports,
  Msecs,
  ObjectPath,
  PartialDeep,
  Percent,
  Pixels,
  Point,
  RenderOutput,
  Seconds,
  Size,
  SizeTuple,
  TextDiffCalc,
  TextSplice,
  TypedObjectPath,
  UntilObservable,
  UriString,
} from 'sys.types/src/types';

export type {
  Cmd,
  CmdEvents,
  CmdImmutable,
  CmdMethodResponder,
  CmdMethodVoid,
  CmdPathsObject,
  CmdType,
} from 'sys.cmd/src/types';
export type { TextCharDiff } from 'sys.data.text/src/types';
export type { CellAddress, TimeDelayPromise } from 'sys.util/src/types';

export type {
  BundleImport,
  SpecImport,
  SpecImports,
  SpecModule,
  TestHandlerArgs,
  TestRunResponse,
  TestSuiteModel,
  TestSuiteRunResponse,
  TestSuiteRunStats,
} from 'sys.test.spec/src/types';

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
  UserAgentOSKind,
} from 'sys.ui.dom/src/types';

export type {
  DevCtx,
  DevCtxDebug,
  DevCtxEdge,
  DevCtxInput,
  DevCtxState,
  DevEnvVars,
  DevEvents,
  DevInfo,
  DevRedrawTarget,
  DevRenderProps,
  DevRenderRef,
  DevRenderer,
  DevValueHandler,
  ModuleListItemHandler,
  ModuleListItemHandlerArgs,
  ModuleListItemVisibility,
  ModuleListItemVisibilityHandler,
  ModuleListScrollTarget,
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
