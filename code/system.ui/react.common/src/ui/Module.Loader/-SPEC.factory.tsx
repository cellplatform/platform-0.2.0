import { Time, type t } from './common';

export type TName = 'foo.instant' | 'foo.delayed';
export type TCtx = { count?: number };

/**
 * Sample renderer factory.
 */
export const factory: t.ModuleLoaderFactory<TName, TCtx> = async (e) => {
  if (e.name === 'foo.instant') {
    const { Sample } = await import('./-SPEC.Components');
    const text = `Sample - ${e.face}`;
    return <Sample {...e} count={e.ctx.count} text={text} />;
  }

  if (e.name === 'foo.delayed') {
    await Time.wait(1000);
    const { Sample } = await import('./-SPEC.Components');
    const text = `Sample (Loaded Async) - ${e.face}`;
    return <Sample {...e} count={e.ctx.count} text={text} />;
  }

  return null;
};
