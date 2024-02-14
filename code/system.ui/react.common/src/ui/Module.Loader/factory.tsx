import { type t } from './common';
import { Stateful } from './ui.Stateful';

type O = Record<string, unknown>;

/**
 * Factory helper.
 *    Convenience method for bulding a factory and providing
 *    pre-built element renderers.
 */
export function factory<TName extends string = string, Ctx extends O = O>(
  factory: t.ModuleLoaderFactory<TName, Ctx>,
) {
  const api: t.ModuleLoaderFactoryBuilder<TName, Ctx> = {
    factory,

    render(name: TName, ctx: Ctx, props = {}) {
      type T = t.ModuleLoaderFactory<TName, any>;
      return <Stateful {...props} name={name} ctx={ctx} factory={factory as T} />;
    },

    ctx(ctx) {
      type T = t.ModuleLoaderFactoryRenderProps;
      const render = (name: TName, props: T = {}) => api.render(name, ctx, props);
      return { ctx, render };
    },
  };

  return api;
}
