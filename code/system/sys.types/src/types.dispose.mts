import { Observable } from 'rxjs';

export type Disposable = {
  dispose(): void;
  readonly dispose$: Observable<void>;
};
