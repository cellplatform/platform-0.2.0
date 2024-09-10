import { type t } from './common';

import { cmdTests as cmd } from './Tests.Cmd';
import { eventTests as events } from './Tests.Cmd.Events';
import { flagsTests as flags } from './Tests.Cmd.Is';
import { patchTests as patch } from './Tests.Cmd.Patch';
import { pathTests as path } from './Tests.Cmd.Path';
import { methodTests as method } from './Tests.Cmd.Method';
import { queueTests as queue } from './Tests.Cmd.Queue';

/**
 * Unit test factory for the <Cmd> system allowing different
 * kinds of source <ImmutableRef> and <Patch> types to be tested
 * against the same standard test suite.
 */
export const Tests = {
  all(setup: t.CmdTestSetup, args: t.TestArgs) {
    Object.entries(Tests.index).forEach(([, test]) => test(setup, args));
  },
  index: {
    cmd,
    events,
    path,
    patch,
    flags,
    method,
    queue,
  },
} as const;
