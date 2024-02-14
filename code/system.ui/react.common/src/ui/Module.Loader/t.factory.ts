import type { t } from './common';

type O = Record<string, unknown>;
type RenderProps = Omit<t.ModuleLoaderStatefulProps, 'name' | 'factory' | 'ctx'>;

/**
 * Factory
 */
export type ModuleFactory<TName extends string = string, Ctx extends O = O> = (
  e: ModuleFactoryArgs<TName, Ctx>,
) => ModuleFactoryResponse;

export type ModuleFactoryArgs<TName extends string = string, Ctx extends O = O> = {
  readonly name: TName;
  readonly ctx: Ctx;
  readonly theme: t.ModuleLoaderTheme;
  readonly face: t.ModuleLoaderFace;
  readonly is: ModuleFactoryFlags;
};

export type ModuleFactoryFlags = {
  readonly front: boolean;
  readonly back: boolean;
  readonly light: boolean;
  readonly dark: boolean;
};

export type ModuleFactoryResponse = Promise<t.RenderOutput>;

/**
 * Factory function builder.
 */
export type ModuleFactoryFunc<TName extends string = string, Ctx extends O = O> = (
  factory: t.ModuleFactory<TName, Ctx>,
) => ModuleFactoryBuilder<TName, Ctx>;

export type ModuleFactoryRenderProps = RenderProps;
export type ModuleFactoryBuilder<TName extends string, Ctx extends O = O> = {
  readonly factory: t.ModuleFactory<TName, Ctx>;
  render(name: TName, ctx: Ctx, props?: RenderProps): JSX.Element;
  ctx(ctx: Ctx): {
    readonly ctx: Ctx;
    render(name: TName, props?: RenderProps): JSX.Element;
  };
};
