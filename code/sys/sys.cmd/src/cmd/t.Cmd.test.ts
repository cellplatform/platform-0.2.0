import type { t } from './common';

/**
 * Factory for abstractly producing test conditions
 * for the standardised unit-tests.
 */
export type CmdTestSetup = () => Promise<CmdTestState>;
export type CmdTestFactory = () => Promise<t.CmdImmutable>;
export type CmdTestState = t.Disposable & {
  readonly doc: t.CmdImmutable;
  readonly factory: CmdTestFactory;
};
