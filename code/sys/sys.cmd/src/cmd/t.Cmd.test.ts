import type { t } from './common';

/**
 * Factory for abstractly producing test conditions
 * for the standardised unit-tests.
 */
export type CmdTestSetup = () => Promise<CmdTestState>;

export type CmdTestState = t.Disposable & {
  readonly doc: t.CmdImmutableRef;
  readonly factory: CmdTestDocFactory;
};

export type CmdTestDocFactory = () => Promise<t.CmdImmutableRef>;
