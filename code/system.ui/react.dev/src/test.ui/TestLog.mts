import { t } from '../common';

type T = { args: t.TestHandlerArgs; ctx: t.SpecCtx };

export const TestLog = {
  create() {
    const logger = {
      items: [] as T[],
      reset: () => (logger.items = []),
      push(args: t.TestHandlerArgs, ctx: t.SpecCtx) {
        logger.items.push({ args, ctx });
      },
      get count() {
        return logger.items.length;
      },
    };
    return logger;
  },
};
