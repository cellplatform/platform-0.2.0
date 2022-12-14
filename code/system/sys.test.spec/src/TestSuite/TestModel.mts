import { maybeWait, DEFAULT, Delete, slug, t, Time, R } from './common';

/**
 * A single test.
 */
export const TestModel = (args: {
  parent: t.TestSuiteModel;
  description: string;
  handler?: t.TestHandler;
  modifier?: t.TestModifier;
}): t.TestModel => {
  const { parent, description, handler, modifier } = args;
  const id = `Test.${slug()}`;

  const run: t.TestRun = (options = {}) => {
    type R = t.TestRunResponse;

    return new Promise<R>(async (resolve) => {
      const tx = `run.tx.${slug()}`;
      const timer = Time.timer();
      const excluded = toExcluded({ modifier, excluded: options.excluded });

      const response: R = {
        id,
        tx,
        ok: true,
        description,
        elapsed: -1,
        timeout: Math.max(0, options.timeout ?? DEFAULT.TIMEOUT),
        excluded,
      };

      let _stopTimeout: () => void = () => null;

      const done = (options: { error?: Error } = {}) => {
        _stopTimeout?.();
        response.elapsed = timer.elapsed.msec;
        response.error = options.error;
        response.ok = !Boolean(response.error);
        resolve(Delete.undefined(response));
      };
      if (!handler || excluded) return done();

      const startTimeout = (msecs: number) => {
        _stopTimeout?.();
        const res = Time.delay(msecs, () => {
          const error = new Error(`Test timed out after ${msecs} msecs`);
          return done({ error });
        });
        _stopTimeout = res.cancel;
      };

      const args: t.TestHandlerArgs = {
        id,
        description,
        ctx: options.ctx,
        timeout(value) {
          response.timeout = Math.max(0, value);
          startTimeout(response.timeout);
          return args;
        },
      };

      try {
        /**
         * Before handler.
         */
        if (options.before) {
          await maybeWait(options.before({ id, description }));
        }

        /**
         * Test handler.
         */
        startTimeout(response.timeout);
        await maybeWait(handler(args));

        /**
         * After handler.
         */
        if (options.after) {
          const elapsed = timer.elapsed.msec;
          await maybeWait(options.after({ id, description, elapsed }));
        }

        return done();
      } catch (error: any) {
        done({ error });
      }
    });
  };

  const model: t.TestModel = {
    parent,
    kind: 'Test',
    id,
    description,
    modifier,
    handler,
    run,
    toString: () => description,
    clone: () => TestModel(args),
  };
  return model;
};

/**
 * Helpers
 */

const toExcluded = (options: {
  modifier?: t.TestModifier;
  excluded?: t.TestModifier[];
}): t.TestModifier[] | undefined => {
  if (options.modifier === 'skip' || Array.isArray(options.excluded)) {
    let list: t.TestModifier[] = [];
    if (options.modifier === 'skip') list.push('skip');
    if (Array.isArray(options.excluded)) list.push(...options.excluded);
    list = R.uniq(list);
    return list.length === 0 ? undefined : list;
  } else {
    return undefined;
  }
};
