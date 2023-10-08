import type { t } from '../common';

/**
 * Immutable object with mutator function.
 */
export type ImmutableNext<T> = (draft: T) => void;
export type Immutable<T> = {
  readonly current: T;
  change(fn: ImmutableNext<T>): void;
};

export type ImmutableRef<T, E> = Immutable<T> & {
  instance: string;
  events(dispose$?: t.Observable<any>): E;
};

/**
type   

  Immutable<T>
  ImmutableRef<T, E>
    - instance:id
    - current:T
    - change()
    - events():E
  
  ↑ Patch<T>   ↑ AutomergeDoc<T>

 */
