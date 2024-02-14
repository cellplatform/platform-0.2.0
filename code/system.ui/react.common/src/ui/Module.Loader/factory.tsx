import { type t } from './common';
import { Stateful } from './ui.Stateful';

type O = Record<string, unknown>;

/**
 * Factory helper.
 *    Convenience method for bulding a factory and providing
 *    pre-built element renderers.
 */
export function factory<TName extends string = string, Ctx extends O = O>(
  load: t.ModuleFactory<TName, Ctx>,
) {
  const api: t.ModuleFactoryRenderer<TName, Ctx> = {
    load,

    render(name: TName, ctx: Ctx, props = {}) {
      type T = t.ModuleFactory<TName, any>;
      return <Stateful {...props} name={name} ctx={ctx} factory={load as T} />;
    },

    ctx(ctx) {
      type T = t.ModuleFactoryRenderProps;
      const render = (name: TName, props: T = {}) => api.render(name, ctx, props);
      return { ctx, render };
    },
  };

  return api;
}
