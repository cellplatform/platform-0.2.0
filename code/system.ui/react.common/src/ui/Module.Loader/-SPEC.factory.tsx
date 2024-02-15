import { Time, type t } from './common';

export type TName = 'foo.instant' | 'foo.delayed';
export type TContext = { count?: number };

/**
 * Sample renderer factory.
 */
export const factory: t.ModuleFactory<TName, TContext> = async (e) => {
  if (e.name === 'foo.instant') {
    const { Sample } = await import('./-SPEC.Components');
    const text = `Sample`;
    return <Sample {...e} count={e.ctx.count} text={text} />;
  }

  if (e.name === 'foo.delayed') {
    await Time.wait(1000);
    const { Sample } = await import('./-SPEC.Components');
    const text = `Sample (Loaded Async)`;
    return <Sample {...e} count={e.ctx.count} text={text} />;
  }

  return null;
};
