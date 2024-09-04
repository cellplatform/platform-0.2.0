/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * Standard:
 *    RFC-6902 JSON patch standard
 *    https://tools.ietf.org/html/rfc6902
 */
export type { Operation as PatchOperation } from 'fast-json-patch';

/**
 * @system
 */
export type {
  Disposable,
  Event,
  EventBus,
  IdString,
  Immutable,
  ImmutableChange,
  ImmutableChangeOptions,
  ImmutableChangeOptionsInput,
  ImmutableEvents,
  ImmutableMutator,
  ImmutableRef,
  Json,
  JsonMap,
  Lifecycle,
  Milliseconds,
  NpmPackageJson,
  ObjectPath,
  UntilObservable,
} from 'sys.types/src/types';

export type { CmdTestFactory, CmdTestSetup, CmdTestState } from 'sys.cmd/src/types';

/**
 * @local
 */
export type * from '../types';
