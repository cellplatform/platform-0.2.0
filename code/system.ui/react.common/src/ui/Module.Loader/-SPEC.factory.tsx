import { Time, type t } from './common';

export type N = 'foo.instant' | 'foo.delayed';

/**
 * Sample renderer factory.
 */
export const factory: t.ModuleLoaderFactory<N> = async (e) => {
  if (e.name === 'foo.instant') {
    const { Sample } = await import('./-SPEC.Components');
    return <Sample {...e} text={`Sample - ${e.face}`} />;
  }

  if (e.name === 'foo.delayed') {
    const { Sample } = await import('./-SPEC.Components');
    await Time.wait(1000);
    return <Sample {...e} text={`Sample (Loaded Async) - ${e.face}`} />;
  }

  return null;
};
