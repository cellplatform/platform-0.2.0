import { t, Is } from '../common';

type T = { args: t.TestHandlerArgs; ctx: t.SpecCtxObject };

export const TestLog = {
  create() {
    const logger = {
      items: [] as T[],
      reset: () => (logger.items = []),
      push(args: t.TestHandlerArgs, ctxInput: t.SpecCtxObject | t.SpecCtx) {
        const ctx = Is.ctx(ctxInput)
          ? (ctxInput as unknown as t.SpecCtx).toObject()
          : (ctxInput as t.SpecCtxObject);
        logger.items.push({ args, ctx });
      },
      get count() {
        return logger.items.length;
      },
    };
    return logger;
  },
};
