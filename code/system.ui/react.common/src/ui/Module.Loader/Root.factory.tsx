import { type t } from './common';
import { Stateful } from './ui.Stateful';

/**
 * Factory helper.
 *    Convenience method for bulding a factory and providing
 *    pre-built element renderers.
 */
export function factory<TName extends string = string>(factory: t.ModuleLoaderFactory<TName>) {
  const api: t.ModuleLoaderFactoryBuilder<TName> = {
    factory,

    render(name: TName) {
      return <Stateful factory={factory} name={name} />;
    },
  };

  return api;
}
