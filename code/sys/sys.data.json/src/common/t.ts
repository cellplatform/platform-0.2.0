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
  Immutable,
  ImmutableChange,
  ImmutableChangeOptions,
  ImmutableMutator,
  ImmutableRef,
  Lifecycle,
  Milliseconds,
  NpmPackageJson,
  ObjectPath,
  UntilObservable,
} from 'sys.types/src/types';

/**
 * @local
 */
export type * from '../types';
