import type { t } from './common.ts';

export type Disposable = {
  dispose(): void;
};

export type Lifecycle = Disposable & {
  readonly disposed: boolean;
};
