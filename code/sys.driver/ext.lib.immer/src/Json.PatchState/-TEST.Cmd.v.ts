import { describe, it, expect, type t, rx } from '../test';
import { Tests } from 'sys.cmd';
import { PatchState } from '.';

describe('Cmd ← PatchState', () => {
  Tests.all(setup, { describe, it, expect });
});

const setup: t.CmdTestSetup = async () => {
  const { dispose, dispose$ } = rx.disposable();
  const factory: t.CmdTestFactory = async () => PatchState.create({});
  const res: t.CmdTestState = { doc: await factory(), factory, dispose, dispose$ };
  return res;
};
