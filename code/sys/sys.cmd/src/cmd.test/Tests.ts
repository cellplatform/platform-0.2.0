import { type t } from './common';

import { cmdTests } from './Tests.Cmd';
import { eventTests } from './Tests.Cmd.Events';
import { flagTests } from './Tests.Cmd.Is';
import { pathTests } from './Tests.Cmd.Path';
import { responseTests } from './Tests.Cmd.Response';

/**
 * Unit test factory for the <Cmd> system allowing different
 * kinds of source <ImmutableRef> and <Patch> types to be tested
 * against the same standard test suite.
 */
export const Tests = {
  all(setup: t.CmdTestSetup, args: t.TestArgs) {
    const index = Tests.index;
    index.cmdTests(setup, args);
    index.pathTests(setup, args);
    index.eventTests(setup, args);
    index.flagTests(setup, args);
    index.responseTests(setup, args);
  },
  index: {
    cmdTests,
    pathTests,
    eventTests,
    flagTests,
    responseTests,
  },
} as const;
